import { Component, Input, OnInit } from '@angular/core';
import { Coordinate } from 'src/app/model/coordinate';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photo-album-container',
  templateUrl: './photo-album-container.component.html',
  styleUrls: ['./photo-album-container.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class PhotoAlbumContainerComponent implements OnInit {

  @Input() coordinate: Coordinate;

  constructor() { }

  ngOnInit() {

  }

}
