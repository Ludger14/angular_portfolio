
import { Component, HostListener, OnInit, Renderer2} from '@angular/core';
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
    formSelect!: FormGroup;

    porfolio: Portfolio = new Portfolio();

    mostrarMensagemErro: boolean = false;
    disableBox: boolean = false;
    showProgressBar: boolean = false;

    contentMessageErro: string;
    contentMessageSuccess: string;

    formationData: any;
    educationData: any;
    projetoData: any; 
    skillsData: any; 
    
    isActive: boolean = false;

    private caminhoCurriculo: string;
    idioma: string;
    
    constructor(private fb: FormBuilder, public translate: TranslateService, 
      private dashboardService: DashboardService,){
        translate.addLangs(['en', 'fr', 'pt-br']);
        translate.setDefaultLang('pt-br');
    }
    
    @HostListener('window:scroll', [])
    onWindowScroll() {
      const button = document.getElementById('scrollToTopButton');
      if (button) {
        if (window.pageYOffset > 300) { // Ajuste esse valor para determinar quando mostrar o botão
          button.classList.add('show');
        } else {
          button.classList.remove('show');
        }
      }
    }

    ngOnInit() { 
        this.form = this.fb.group({
            nome: ['', [Validators.required, Validators.maxLength(255)]],
            email: ['', [Validators.required, Validators.maxLength(255)]],
            subject: ['', [Validators.required, Validators.maxLength(255)]],
            message: ['', [Validators.required]],
        });

        this.formSelect = this.fb.group({
          idioma: ['pt-br'],
        });

        this.idioma = 'pt-br';

        this.translate.get('HOME.formation').subscribe(data => {
          this.formationData = data;
        });

        this.translate.get('HOME.experience').subscribe(data => {
          this.educationData = data;
        });

        this.translate.get('HOME.projeto').subscribe(data => {
          this.projetoData = data;
        });

        this.translate.get('HOME.skills').subscribe(data => {
          this.skillsData = data;
        });
    } 
    
    submit(form: any) {
      this.disableBox = true;
      if (form.invalid) {
        this.mostrarMensagemErro = true;
        this.contentMessageErro = 'HOME.form.CamposObrigatorios';
        this.disableBox = false;
        this.clearMessagesAfterTimeout();
      } else {
        this.showProgressBar = true;
        this.dashboardService.saveMessage(this.porfolio).subscribe((response: any) => {
          if (response.body.success) {
            this.mostrarMensagemErro = true;
            this.contentMessageSuccess = 'HOME.form.FormularioEnviadoComSucesso';
            this.clearForm();
          } else {
            this.mostrarMensagemErro = true;
            this.contentMessageErro = 'HOME.form.ErroAoEnviarEmail';
          }
          this.disableBox = false; 
          this.showProgressBar = false;   
          this.clearMessagesAfterTimeout();
        });
      }      
    }    

    clearMessagesAfterTimeout() {
      setTimeout(() => {
        this.mostrarMensagemErro = false;
        this.contentMessageErro = null;
        this.contentMessageSuccess = null;
      }, 10000);
    }
  
    clearForm() {
      this.form.reset();
    }

    onLanguageChange(selectedLang: string) {
      this.translate.use(selectedLang);
      this.updateTranslatedData();
    }

    updateTranslatedData() {
      this.translate.get('HOME.formation').subscribe(data => {
        this.formationData = data;
      });
  
      this.translate.get('HOME.experience').subscribe(data => {
        this.educationData = data;
      });
  
      this.translate.get('HOME.projeto').subscribe(data => {
        this.projetoData = data;
      });

      this.translate.get('HOME.skills').subscribe(data => {
        this.skillsData = data;
      });
    }

    onLanguage(){
      let idioma = this.formSelect.controls['idioma'].value;  
      this.idioma = idioma;  
      this.caminhoCurriculo = null;
      this.translate.use(idioma);
      this.updateTranslatedData();
    }

    fechar(){
      this.mostrarMensagemErro = false;
      this.contentMessageErro = null;
      this.contentMessageSuccess = null;
    }

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    toggleActive(item) {
      this.skillsData.forEach(skill => skill.isActive = false);
      item.isActive = !item.isActive;
    }

    obterCaminhoCurriculo(): void {
      const uniqueParam = new Date().getTime().toString(); // Adicione um parâmetro único
      this.dashboardService.downloadCurriculo(this.idioma, uniqueParam)
        .subscribe(
          (response: any) => {
            // Crie uma blob com os dados recebidos
            const blob = new Blob([response], { type: 'application/pdf' });
    
            // Crie uma URL para o blob e defina-a como o caminho do currículo
            this.caminhoCurriculo = URL.createObjectURL(blob);
            console.log(this.caminhoCurriculo);
          },
          (error) => {
            // Lide com erros, por exemplo, definindo um valor padrão para o caminho do currículo
            console.error('Erro ao obter o caminho do currículo:', error);
            this.caminhoCurriculo = 'URL_DO_SEU_CURRICULO_PDF';
          }
        );
    }

    onDownloadClick() {
      this.obterCaminhoCurriculo();
    
      // Aguarde até que a URL do currículo seja obtida
      const interval = setInterval(() => {
        if (this.caminhoCurriculo) {
          // Pare o intervalo assim que a URL estiver disponível
          clearInterval(interval);
    
          // Abra uma nova janela para iniciar o download do arquivo
          window.open(this.caminhoCurriculo, '_blank');
        }
      }, 500); // Intervalo de verificação de 500 milissegundos
    }
    
    
}
