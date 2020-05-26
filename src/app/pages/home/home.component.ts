import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MainService } from "../../services/main.service";

import { environment } from "../../../environments/environment";
import { LoginEOSService } from "eos-ulm";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(
    private MainService: MainService,
    public loginEOSService: LoginEOSService
  ) {}
  WINDOW: any = window;
  // connected = localStorage.getItem("user") === "connected" ? true : false;
  connected: boolean;
  challenger;
  // eos = this.MainService.returnEosNet();
  recentPlayers = localStorage.getItem("players")
    ? localStorage.getItem("players").split(",")
    : [];
  config = environment;
  placeholder = "";

  initScatter() {
    this.loginEOSService.openPopup();
  }

  createGame(challenger) {
    this.MainService.createGame(challenger);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.connected =
      localStorage.getItem("user") === "connected" ? true : false;

    this.placeholder = `Enter ${this.config.coinName} account you'd like to challenge`;
  }
}
