import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { HashLocationStrategy,LocationStrategy } from '@angular/common';


const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'dashboard.senselive.in',
  port: 9001,
  protocol: 'ws',
  username: 'Sense2023',
  password: 'sense123'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS)
  ],
  providers: [{provide : LocationStrategy , useClass : HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
