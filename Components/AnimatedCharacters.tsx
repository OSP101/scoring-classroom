const AnimatedCharacters = () => {
    return (
      <div style={{ position: 'relative', overflow: 'hidden', height: '100vh' }}>
        <img
          src="/santa_and_reindeer.png"
          alt="Santa"
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '0',
            width: '100px',
            animation: 'moveSanta 10s linear infinite',
          }}
        />
        {/* <img
          src="/reindeer.png"
          alt="Reindeer"
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '-200px',
            width: '150px',
            animation: 'moveReindeer 10s linear infinite',
          }}
        /> */}
        <style jsx>{`
          @keyframes moveSanta {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(100vw);
            }
          }
        `}</style>
      </div>
    );
  };
  
  export default AnimatedCharacters;
  