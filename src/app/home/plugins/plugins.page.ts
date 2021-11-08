import { Component, OnInit } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { distinctUntilChanged, filter, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.page.html',
  styleUrls: ['./plugins.page.scss'],
})
export class PluginsPage implements OnInit {
  location = new BehaviorSubject<{ lat: number, lng: number }>(null);
  constructor(
    private platform: Platform,
    private geolocation: Geolocation,
    private backgroundMode: BackgroundMode
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.watchDriverLocation();
    this.setupBackgroundMode();
  }

  private watchDriverLocation() {
    const watch = this.geolocation.watchPosition({
      maximumAge: 0,
      enableHighAccuracy: true
    });

    watch.pipe(
      distinctUntilChanged(),
      throttleTime(5000),
    )
      .subscribe(position => {
        if ('coords' in position) {
          const location = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.location.next(location);
        }
      });

  }

  private setupBackgroundMode() {

    this.platform.pause.subscribe(() => {
      this.backgroundMode.enable();
      this.backgroundMode.moveToBackground();
    });



    this.platform.resume.subscribe(() => {
      this.backgroundMode.disable();
      this.backgroundMode.moveToForeground();
    });

    this.backgroundMode.on('activate').subscribe(() => {
      this.backgroundMode.disableBatteryOptimizations();
      this.backgroundMode.disableWebViewOptimizations();
      this.backgroundMode.setDefaults();
    });
  }
}


