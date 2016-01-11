from tornado.ioloop import IOLoop, PeriodicCallback
from tornado import web, websocket
from tornado.options import define, options

define("port", default=80, help="run on the given port", type=int)


class NoCacheStaticFileHandler(web.StaticFileHandler):
    def set_extra_headers(self, path):
        self.set_header("Cache-control",
                        'no-store, no-cache, must-revalidate, max-age=0')


class socketHandler(websocket.WebSocketHandler):
    def open(self, *args):
        self.message = 0
        print("Web socket open")
        self.periodicCallback = PeriodicCallback(self.sendMessage, 1000)
        self.periodicCallback.start()
    
    def sendMessage(self):
        #self.message = int(self.message) + 1  # Uncomment for push only
        self.write_message(str(self.message))
        print("Message send: %s" % str(self.message))
    
    def on_message(self, message):
        self.message = int(message)
        print("Message received: %s" % str(message))
        
    def on_close(self):
        print("Web socket closed")
        self.periodicCallback.stop()

app = web.Application([
    (r'/webSocket()', socketHandler),
    (r'/()', NoCacheStaticFileHandler, {'path': './index.html'}, ),
    (r'/(.*)', NoCacheStaticFileHandler, {'path': './'}, ),
])

if __name__ == '__main__':
    app.listen(options.port)
    mainIOLoop = IOLoop.instance()  # Main IOLoop
    mainIOLoop.start()  # start Main IOLoop
