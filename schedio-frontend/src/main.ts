/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
//Comentario de prueba para la integracion de github al jira
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
