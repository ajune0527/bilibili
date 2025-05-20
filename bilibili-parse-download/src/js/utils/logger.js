// @ts-nocheck

const levels = {
    log: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
  };
  
  let currentLevel = levels['warn']; // 默认日志级别
  
  function setLogLevel(level) {
    if (levels[level] !== undefined) {
      currentLevel = levels[level];
    } else {
      console.warn(`Unknown log level: ${level}`);
    }
  }
  
  function getCallerLocation() {
    console.trace();
    const error = new Error();
    const stackLines = error.stack.split('\n');
  
    for (let i = 2; i < stackLines.length; i++) {
      if (!stackLines[i].includes('umi.js') && !stackLines[i].includes('<anonymous>')) {
        const urlMatch = /at (.*) \((.*):(\d+):(\d+)\)/.exec(stackLines[i]);
        if (urlMatch) {
          const [, func, file, line, column] = urlMatch;
          return `${file}:${line}:${func}:${column}`;
        }
        const simpleMatch = /at (.*):(\d+):(\d+)/.exec(stackLines[i]);
        if (simpleMatch) {
          const [, file, line, column] = simpleMatch;
          return `${file}:${line}:${column}`;
        }
      }
    }
    return 'unknown location';
  }
  
  function logMessage(level, ...messages) {
    if (levels[level] >= currentLevel) {
      const timestamp = new Date().toISOString();
      const formattedMessages = messages.map((message) =>
        typeof message === 'object' ? message : message,
      );
      // const location = getCallerLocation();
      console[level](`[${timestamp}] [${level.toUpperCase()}]`, ...formattedMessages);
      if (level === 'error' && messages[0] instanceof Error && messages[0].stack) {
        console[level](messages[0].stack);
      }
    }
  }
  
  const Logger = {
    setLogLevel,
    log: (...messages) => logMessage('log', ...messages),
    debug: (...messages) => logMessage('debug', ...messages),
    info: (...messages) => logMessage('info', ...messages),
    warn: (...messages) => logMessage('warn', ...messages),
    error: (...messages) => logMessage('error', ...messages),
  };
  
  export default Logger;
  