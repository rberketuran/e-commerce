import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { ItemContainer } from "./home/item-container/item-container";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {
  protected readonly title = signal('frontend');
}
