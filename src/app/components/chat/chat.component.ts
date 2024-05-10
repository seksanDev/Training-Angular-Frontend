import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import SockJS from "sockjs-client";
import * as Stomp from "stompjs"
import { ChatService } from '../../services/chat.service';
import { IChatMessage } from '../../interfaces/i-chat-message';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  constructor(private chatService: ChatService) { }
  ngOnInit(): void {
    this.connectWebsocket();
  }
  private stompClient: any;
  isConnected = false;
  private CHANEL = '/topic/chat';
  private ENDPOINT = 'http://localhost:8080/socket';
  messages: IChatMessage[] = [];
  chatFormGroup: FormGroup = new FormGroup({
    message: new FormControl('', Validators.required)
  })

  private connectWebsocket() {
    let ws = new SockJS(this.ENDPOINT);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function () {
      that.isConnected = true;
      that.subscribeToGlobalChat();
    });
  }
  private subscribeToGlobalChat() {
    this.stompClient.subscribe(this.CHANEL, (message: any) => {

      let newMessage = JSON.parse(message.body) as IChatMessage;
      console.log(newMessage);
      this.messages.push(newMessage);
    });
  }
  onSubmit() {
    let message = this.chatFormGroup.controls['message'].value;
    //is connected?
    if (!this.isConnected) {
      alert('Please connect to Websocket');
      return;

    }
    this.chatService.postMessage(message).subscribe(
      {
        error: error => console.log(error)
      }
    )

  }
}
