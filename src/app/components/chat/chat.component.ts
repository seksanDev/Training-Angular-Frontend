import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import SockJS from "sockjs-client";
import * as Stomp from "stompjs"
import { ChatService } from '../../services/chat.service';
import { IChatMessage } from '../../interfaces/i-chat-message';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent]
})
export class ChatComponent implements OnInit {
  constructor(private chatService: ChatService) { }
  ngOnInit(): void {
    this.connectWebsocket();
  }
  private stompClient: any;
  isConnected = false;
  private CHANNEL = '/topic/chat';
  private ENDPOINT = 'http://localhost:8080/socket';
  messages: IChatMessage[] = [];
  chatFormGroup: FormGroup = new FormGroup({
    message: new FormControl('', Validators.required)
  })

  private connectWebsocket(): void {
    let ws = new SockJS(this.ENDPOINT);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function () {
      that.isConnected = true;
      that.subscribeToGlobalChat();
    });
  }

  private subscribeToGlobalChat(): void {
    this.stompClient.subscribe(this.CHANNEL, (message: any) => {

      let newMessage = JSON.parse(message.body) as IChatMessage;
      console.log(newMessage);
      this.messages.push(newMessage);
    });
  }
  onSubmit(): void {
    let message = this.chatFormGroup.controls['message'].value;
    //is connected?
    if (!this.isConnected) {
      alert('Please connect to Websocket');
      return;

    }
    this.chatService.postMessage(message).subscribe(
      {
        next: response => console.log(response),
        error: error => console.log(error)
      }
    )

  }
}
