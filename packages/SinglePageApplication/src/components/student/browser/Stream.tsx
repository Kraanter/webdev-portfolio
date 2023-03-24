/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect, Socket } from 'socket.io-client';

type Props = {
  socket: Socket;
};

function createSocket() {
  const socket = connect('/', {
    path: '/browser-streamer',
    withCredentials: true,
    autoConnect: false,
  });
  return socket;
}

const Stream: React.FC = () => {
  const socket = useRef(createSocket()).current;
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      socket.connect();
      socket.on('connected', () => {
        setIsConnected(true);
      });
    }
  }, []);

  return (
    // <div ref={wrap} id="wrap" style={{ width: '100%', height: '100%', padding: 0, margin: 0 }}>
    // <div className="popup" onScroll={mouseScroll} draggable="false">
    <>
      {!isConnected && <div className="loading">Loading...</div>}

      {isConnected && <ImageStream socket={socket} />}
    </>
    //     </div>
    //   </div>
    // </div>
  );
};

const ImageStream = ({ socket }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState('default');
  const [image, setImage] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [fullHeight, setFullHeight] = useState(0);

  const keydown = useCallback((event: any) => {
    if ((event.ctrlKey || event.metaKey) && ['v', 'c'].includes(event.key)) {
      return;
    }
    console.log(event);
    socket.emit('keydown', {
      key: event.key,
    });
  }, []);

  const paste = useCallback((event: any) => {
    event.preventDefault();

    // @ts-ignore
    const paste = (event.clipboardData || window.clipboardData).getData('text');
    socket.emit('paste', {
      content: paste,
    });
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', keydown);
    document.addEventListener('paste', paste);

    socket.emit('view', {
      url: 'https://www.youtube.com/',
      viewport: {
        width: wrap.current?.offsetWidth,
        height: wrap.current?.offsetHeight,
      },
    });

    socket.on('image', ({ img, fullHeight }) => {
      setImage('data:image/jpeg;base64,' + img);
      setIsLoading(false);
      setFullHeight(fullHeight);
    });

    socket.on('cursor', (cursor) => {
      setCursor(cursor);
    });

    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('paste', paste);
    };
  }, []);

  const mouseMove = useCallback((event: any) => {
    const position = event.currentTarget.getBoundingClientRect();
    const widthChange = (wrap.current?.offsetWidth ?? 0) / position.width;
    const heightChange = (wrap.current?.offsetHeight ?? 0) / position.height;

    socket.emit('mouseMove', {
      x: widthChange * (event.pageX - position.left),
      y: heightChange * (event.pageY - position.top - document.documentElement.scrollTop),
    });
  }, []);

  const mouseClick = useCallback((event: any) => {
    const position = event.currentTarget.getBoundingClientRect();
    const widthChange = (wrap.current?.offsetWidth ?? 0) / position.width;
    const heightChange = (wrap.current?.offsetHeight ?? 0) / position.height;

    socket.emit('mouseClick', {
      x: widthChange * (event.pageX - position.left),
      y: heightChange * (event.pageY - position.top - document.documentElement.scrollTop),
    });
  }, []);

  const mouseScroll = useCallback((event: any) => {
    const position = event.currentTarget.scrollTop;
    socket.emit('scroll', {
      position,
    });
  }, []);

  return (
    <div ref={wrap} id="wrap" style={{ width: '100%', height: '100%', padding: 0, margin: 0 }}>
      <div className="w-8/10 h-5/6 p-5 overflow-auto" onScroll={mouseScroll} draggable="false">
        {isLoading && (
          <div className="loading">
            <div
              style={{ borderTopColor: 'transparent' }}
              className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"
            ></div>
          </div>
        )}
        <div
          ref={ref}
          className="relative bg-white w-full h-full"
          style={{ cursor, height: fullHeight }}
          draggable="false"
        >
          {image && (
            <img
              className="top-0 sticky w-full"
              src={image}
              onMouseMoveCapture={mouseMove}
              onClick={mouseClick}
              draggable="false"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Stream;
