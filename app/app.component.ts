import {Component, Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

@Component({
    selector: 'angular-app',
    template: `
    <h1>Angular 2 + reconnecting websockets</h1>
    <p>Websocket simple counter: {{ data }}</p>
    `
})

export class AppComponent {
    private counter = 0;
    private ws;
    private data = 0;
    
    constructor(public http: Http) {
        this.webSocketConnect();
    }
    
    webSocketConnect() {
        // Next line is remote websocket echo (not working with push only)
        this.ws = new WebSocket('ws://echo.websocket.org');
        // Next line is local websocket echo (same as above) and push only
        //this.ws = new WebSocket('ws://127.0.0.1/webSocket');
        this.ws.onerror = (evt) => console.log('Error');
        // Comment next line for push only from local websocket
        this.ws.onmessage = (evt) => this.weSocketMessage(evt.data);
        // Uncomment next line for push only from local websocket
        //this.ws.onmessage = (evt) => this.data = evt.data;
        this.ws.onclose = (evt) => this.webSocketClose();
        this.ws.onopen = (evt) => this.weSocketMessage(evt.data);
    }
    
    webSocketClose() {
        console.log('Closed');
        setTimeout(function() {
        }, 5000);  // 5 seconds timeout
        this.webSocketConnect();
    }
    
    weSocketMessage(data) {
        this.data = data;
        var that = this;  // Proper context for setTimeout inner function
        setTimeout(function() {
            that.ws.send(`${ that.counter }`);
            that.counter += 1;
        }, 2000);  // 2 seconds timeout
    }
}