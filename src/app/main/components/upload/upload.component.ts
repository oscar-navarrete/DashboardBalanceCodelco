import { Component, OnInit, Input } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  @Input() accept = '';
  @Input() multiple = '';
  @Input() events: any;
  @Input() returnJSON = false;
  

  files: any[] = [];
  filesToProcess: any[] = [];
  event: any;
  response: any;
  viewProgressFiles = false;
  loading = false;
  another = false;
  title = 'Cargando archivos...';
  doneMessage = 'Listo!!';
  errorAccept = false;

  constructor() {

  }

  onEvent = (event: string): void => {
    this.events[event]({
        ok: true,
        event,
        response: this.response,
        timestamp: new Date()
    });
  }

  //VALIDATE EXPLICIT FOR XLS AND XLSX
  validateExtension(_files){
    let files = [];
    for (const item of _files) {
      files.push(item);
    }
    for (const file of files) {
      const ext = '.' + file.name.split('.')[file.name.split('.').length - 1];
      const acceptArray: Array<any> = ".xls,.xlsx".split(',');
      if (acceptArray.includes(ext)) {
      }else{
        this.errorAccept = true;
        return false;
      }
    }
    this.errorAccept = false;
    return true;
  }

  /**
   * on file drop handler
   */
  onFileDropped($event): void {
    if(this.validateExtension($event)){
      this.prepareFilesList($event);
    }
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event, files): void {
    if(this.validateExtension(files)){
      this.loading = true;
      this.event = event;
      this.prepareFilesList(files);
    }
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number): void {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number): void {
    setTimeout(() => {
      if (index === this.filesToProcess.length) {
        this.loading = false;
        this.another = true;
        this.filesToProcess = [];
        this.files = [];
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.filesToProcess[index].progress === 100) {
            clearInterval(progressInterval);
            if (this.multiple !== 'mutiple') {
              this.selectFile();
            } 
            this.uploadFilesSimulator(index + 1);
          } else {
            this.filesToProcess[index].progress += 5;
          }
        }, 50);
      }
    }, 1000);
  }



  selectFile(): void {
    /* wire up file reader */

    const target: DataTransfer = (this.event.target) as DataTransfer;

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary', bookDeps:true});
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.response = (XLSX.utils.sheet_to_json(ws, { defval: '' }));

      console.log('this.returnJSON', this.returnJSON);
      if (this.returnJSON === true) {
        this.onEvent('onImport');
      }

      // console.log((XLSX.utils.sheet_to_json(ws)));
      /* save data */
      // this.record = (XLSX.utils.sheet_to_json(ws));
         
    };

    reader.readAsBinaryString(target.files[0]);
  }



  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>): void {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }

    for (const file of this.files) {
      const ext = '.' + file.name.split('.')[file.name.split('.').length - 1];
      this.accept = this.accept.replace(' ', '');
      const acceptArray: Array<any> = this.accept.split(',');
      if (acceptArray.includes(ext)) {
          this.filesToProcess.push(file);
      }
    }

    // this.files = this.files.filter( (file: any) => file.name.split('.')[file.name.split('.').length - 1] === 'xlsx' );

    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
