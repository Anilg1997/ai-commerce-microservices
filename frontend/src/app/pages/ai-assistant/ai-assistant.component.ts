import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-page">
      <div class="ai-header">
        <h1>AI Shopping Assistant</h1>
        <p>Powered by RAG + LangChain4j + Ollama — Ask anything about products, orders, or get recommendations</p>
      </div>
      <div class="ai-layout">
        <div class="ai-chat">
          <div class="chat-messages">
            <div class="message assistant" *ngFor="let msg of chatHistory">
              <div class="msg-role">{{ msg.role === 'user' ? 'You' : 'AI Assistant' }}</div>
              <div class="msg-content">{{ msg.content }}</div>
            </div>
            <div class="message hint" *ngIf="chatHistory.length === 0">
              <div class="msg-role">AI Assistant</div>
              <div class="msg-content">
                Hello! I'm your AI shopping assistant. I can help you:
                <ul>
                  <li>Find products and compare options</li>
                  <li>Analyze sales funnel and platform health</li>
                  <li>Get personalized recommendations</li>
                  <li>Execute MCP tools for data analysis</li>
                </ul>
                Try asking me something!
              </div>
            </div>
          </div>
          <div class="chat-input">
            <textarea [(ngModel)]="userMessage" placeholder="Ask about products, orders, or request analysis..." (keydown.enter)="sendMessage($event)"></textarea>
            <button (click)="sendMessage()" [disabled]="!userMessage.trim()">Send</button>
          </div>
        </div>
        <div class="ai-tools">
          <div class="tool-card" (click)="quickAsk('Find the best products for learning Java microservices and AI')">
            <span class="tool-icon">🔍</span>
            <span>Product Search</span>
          </div>
          <div class="tool-card" (click)="quickAsk('Analyze the registration to delivery conversion funnel')">
            <span class="tool-icon">📊</span>
            <span>Funnel Analysis</span>
          </div>
          <div class="tool-card" (click)="quickAsk('Compare laptops and recommend the best one for developers')">
            <span class="tool-icon">⚖️</span>
            <span>Compare Products</span>
          </div>
          <div class="tool-card" (click)="executeMCP()">
            <span class="tool-icon">🔧</span>
            <span>MCP: Dashboard Data</span>
          </div>
          <div class="tool-card" (click)="quickAsk('What events flow through the Kafka commerce.events topic?')">
            <span class="tool-icon">📋</span>
            <span>System Knowledge</span>
          </div>
          <div class="tool-card" (click)="getAgentPlan()">
            <span class="tool-icon">📝</span>
            <span>Agent Plan</span>
          </div>
        </div>
      </div>
      <div class="mcp-result" *ngIf="mcpResult">
        <h3>MCP Tool Result: {{ mcpResult.tool }}</h3>
        <pre>{{ mcpResult.result }}</pre>
      </div>
      <div class="agent-plan" *ngIf="agentPlan">
        <h3>Agent Plan: {{ agentPlan.agent }}</h3>
        <ol>
          <li *ngFor="let step of agentPlan.steps">{{ step }}</li>
        </ol>
      </div>
    </div>
  `,
  styles: [`
    .ai-page { max-width: 1100px; margin: 0 auto; }
    .ai-header { text-align: center; margin-bottom: 24px; }
    .ai-header h1 { font-size: 28px; margin: 0 0 8px; }
    .ai-header p { color: #666; font-size: 14px; max-width: 600px; margin: 0 auto; }
    .ai-layout { display: grid; grid-template-columns: 1fr 200px; gap: 16px; }
    .ai-chat { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); display: flex; flex-direction: column; height: 500px; }
    .chat-messages { flex: 1; overflow-y: auto; padding: 20px; }
    .message { margin-bottom: 16px; }
    .msg-role { font-size: 12px; font-weight: 600; color: #2874f0; margin-bottom: 4px; text-transform: uppercase; }
    .msg-content { font-size: 14px; line-height: 1.6; color: #333; padding: 12px 16px; background: #f5f7fa; border-radius: 8px; }
    .message.user .msg-content { background: #e3f2fd; }
    .message.hint .msg-content { background: #fff8e1; }
    .message.hint ul { margin: 8px 0; padding-left: 20px; }
    .message.hint li { margin-bottom: 4px; }
    .chat-input { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid #f0f0f0; }
    .chat-input textarea { flex: 1; min-height: 44px; max-height: 80px; padding: 10px 14px; border: 1px solid #e0e0e0; border-radius: 8px; resize: none; }
    .chat-input button { padding: 10px 24px; background: #2874f0; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .chat-input button:disabled { background: #ccc; }
    .ai-tools { display: flex; flex-direction: column; gap: 8px; }
    .tool-card { background: white; border-radius: 10px; padding: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px; transition: transform 0.2s; }
    .tool-card:hover { transform: translateX(-4px); background: #f5f7fa; }
    .tool-icon { font-size: 18px; }
    .mcp-result, .agent-plan { background: white; border-radius: 12px; padding: 20px; margin-top: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .mcp-result h3, .agent-plan h3 { margin: 0 0 12px; font-size: 16px; }
    .mcp-result pre { background: #f5f7fa; padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; max-height: 300px; }
    .agent-plan ol { margin: 0; padding-left: 20px; }
    .agent-plan li { padding: 4px 0; font-size: 14px; }
    @media (max-width: 768px) { .ai-layout { grid-template-columns: 1fr; } .ai-tools { flex-direction: row; flex-wrap: wrap; } .tool-card { flex: 1; min-width: 120px; } }
  `]
})
export class AiAssistantComponent {
  userMessage = '';
  chatHistory: { role: string; content: string }[] = [];
  mcpResult: any = null;
  agentPlan: any = null;

  constructor(private api: ApiService) {}

  sendMessage(event?: KeyboardEvent) {
    if (event?.shiftKey) return;
    if (event) event.preventDefault();
    const msg = this.userMessage.trim();
    if (!msg) return;
    this.chatHistory.push({ role: 'user', content: msg });
    this.userMessage = '';

    this.api.askAi(msg).subscribe({
      next: res => this.chatHistory.push({ role: 'assistant', content: res.data.answer }),
      error: () => this.chatHistory.push({ role: 'assistant', content: 'AI service unavailable. Start ai-service and Ollama.' })
    });
  }

  quickAsk(question: string) {
    this.userMessage = question;
    this.sendMessage();
  }

  executeMCP() {
    this.api.mcpExecute('dashboard_analysis', {}).subscribe({
      next: res => this.mcpResult = res.data,
      error: () => this.mcpResult = { tool: 'error', result: 'MCP service unavailable', status: 'error' }
    });
  }

  getAgentPlan() {
    this.api.getAgentPlan('Help me shop for the best developer laptop').subscribe({
      next: res => this.agentPlan = res.data,
      error: () => this.agentPlan = { agent: 'error', steps: ['Service unavailable'] }
    });
  }
}
