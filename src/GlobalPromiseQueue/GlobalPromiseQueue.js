// GlobalPromiseQueue.js
class GlobalPromiseQueue {
    constructor() {
      this.queue = [];
      this.isProcessing = false;
      this.i = 0;
    }
  
    enqueue(fn) {
      return new Promise((resolve, reject) => {
        this.queue.push({ fn, resolve, reject });
        this.processQueue();
      });
    }
  
    processQueue() {
      if (this.isProcessing || this.queue.length === 0) {
        return;
      }
  
      this.isProcessing = true;
      
      while (this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      fn()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
      }
      this.isProcessing = false;
    }
  }
  
  export default new GlobalPromiseQueue();