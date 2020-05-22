import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./pages/home/home.component";

import { appRoutes } from "./main.router";

import { MainService } from "./services/main.service";
import { TopComponent } from "./pages/top/top.component";

import { FormsModule } from "@angular/forms";
import { MyGamesComponent } from "./pages/my-games/my-games.component";
import { CallsComponent } from "./pages/calls/calls.component";

import { HttpClientModule } from "@angular/common/http";
import { LoginEOSModule } from "eos-ulm";
import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopComponent,
    MyGamesComponent,
    CallsComponent,
  ],
  imports: [
    BrowserModule,
    appRoutes,
    FormsModule,
    HttpClientModule,
    LoginEOSModule.forRoot({
      appName: "roshambo-EOS-frontend",
      httpEndpoint: environment.Eos.httpEndpoint,
      chain: environment.chain,
      verbose: environment.Eos.verbose,
      blockchain: environment.network.blockchain,
      host: environment.network.host,
      port: environment.network.port,
      protocol: environment.network.protocol,
      expireInSeconds: environment.network.expireInSeconds,
    }),
  ],
  providers: [MainService],
  bootstrap: [AppComponent],
})
export class AppModule {}
