
import { Component, OnInit, Renderer2} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from "@angular/platform-browser";
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { CdkDragDrop, DragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Portfolio } from '../model/portfolio.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit{

    form!: FormGroup;

    porfolio: Portfolio = new Portfolio();

    mostrarMensagemErro: boolean = false;

    contentMessageErro: string;
    contentMessageSuccess: string;

    formationData: any;
    educationData: any;
    projetoData: any;
    
    constructor(private fb: FormBuilder, private route : Router, private router: ActivatedRoute, private httpClient: HttpClient,
      private renderizar: Renderer2, private alertModalService: AlertModalService, public translate: TranslateService, 
      private dashboardService: DashboardService,){
        translate.addLangs(['English', 'Français', 'Português']);
        translate.setDefaultLang('Português');

        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/English|Français/) ? browserLang : 'Português');
    }
    

    ngOnInit() { 
        this.form = this.fb.group({
            nome: ['', [Validators.required, Validators.maxLength(255)]],
            email: ['', [Validators.required]],
            subject: ['', [Validators.required]],
            message: ['', [Validators.required]],
        });

        this.translate.onLangChange.subscribe(() => {
          this.translate.get('HOME.formation').subscribe(data => {
            this.formationData = data;
          });
        });

        this.translate.onLangChange.subscribe(() => {
          this.translate.get('HOME.experience').subscribe(data => {
            this.educationData = data;
          });
        });

        this.translate.onLangChange.subscribe(() => {
          this.translate.get('HOME.projeto').subscribe(data => {
            this.projetoData = data;
          });
        });
    }

    ngOnDestroy(): void {
    } 
    
    submit(form: any) {
      if (form.invalid) {
        this.mostrarMensagemErro = true;
        this.contentMessageErro = 'HOME.form.CamposObrigatorios';
        setTimeout(() => {
          this.mostrarMensagemErro = false;
          this.contentMessageErro = null;
        }, 10000);
      } else {
        this.dashboardService.saveMessage(this.porfolio).subscribe((response: any) => {
          if (response.body.success) {
            this.mostrarMensagemErro = true;
            this.contentMessageSuccess = 'HOME.form.FormularioEnviadoComSucesso';
          } else {
            this.mostrarMensagemErro = true;
            this.contentMessageErro = 'HOME.form.ErroAoEnviarEmail';
          }
    
          setTimeout(() => {
            this.mostrarMensagemErro = false;
            this.contentMessageErro = null;
            this.contentMessageSuccess = null;
          }, 10000);
          this.limparCampos();
        });
      }      
    }
    

    limparCampos(){
      this.form.reset();
    }

    changeLanguage(lang: string) {
      this.translate.use(lang);
    }
}
