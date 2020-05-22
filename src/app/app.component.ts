import { Component, OnInit } from "@angular/core";
import { MainService } from "./services/main.service";
import { HttpClient } from "@angular/common/http";

import { environment } from "../environments/environment";

import * as moment from "moment";

import { forkJoin } from "rxjs";
import { take } from "rxjs/operators";
import { LoginEOSService } from "eos-ulm";
import ScatterJS from "scatterjs-core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private MainService: MainService,
    private http: HttpClient,
    public loginEOSService: LoginEOSService
  ) {
    this.MainService.setPlayer(environment.botName);
  }

  WINDOW: any = window;
  connected: boolean;
  userName;
  // eos = this.MainService.returnEosNet();
  gamesPlayed;
  timeUpdate = 60000;
  GAMES_M = [];
  GAMES_C = [];
  moment = moment;
  version = environment.version;
  configStyle = environment.style;
  logout() {
    this.loginEOSService.logout();
  }

  // initScatter() {
  //   this.MainService.initScatter((err, account) => {
  //     if (err) {
  //       return console.error(err);
  //     }
  //     this.userName = account;
  //   });
  // }

  createGamesTable() {
    this.http.get("/api/v1/games/log").subscribe(
      (res: any) => {
        this.gamesPlayed = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  createNavDropdowns() {
    this.MainService.getGameChallenges((err, challenges) => {
      if (err) {
        return console.error(err);
      }
      this.GAMES_M = challenges;
    });

    this.MainService.getMyGamesCalls((err, calls) => {
      if (err) {
        return console.error(err);
      }
      this.GAMES_C = calls;
    });
  }

  enebleConfig() {
    window.document.title = this.configStyle.title;
    window.document.getElementsByTagName(
      "body"
    )[0].style.background = this.configStyle.body.background;
  }

  ngOnInit() {
    this.createGamesTable();
    this.enebleConfig();
    setInterval(() => {
      this.createNavDropdowns();
    }, 1000);
    // if (this.connected) {
    //   if (!this.WINDOW.ScatterJS) {
    //     document.addEventListener("scatterLoaded", () => {
    //       this.initScatter();
    //     });
    //   } else {
    //     this.initScatter();
    //   }
    // }
    this.loginEOSService.loggedIn.subscribe(() => {
      this.MainService.accountName = this.loginEOSService.accountName;
      this.userName = this.loginEOSService.accountName;
      this.connected =
        localStorage.getItem("walletConnected") === "connected" ? true : false;
    });
  }
}
