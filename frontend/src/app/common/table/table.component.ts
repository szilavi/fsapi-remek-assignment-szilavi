import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SymbolPipe } from 'src/app/pipe/symbol.pipe';
import { AuthService } from 'src/app/service/auth.service';
import { ITableCol } from 'src/app/service/config.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [SymbolPipe],
})
export class TableComponent implements OnInit {
  @Input() dataService: any;
  @Input() serviceMethod: string | undefined;
  @Input() dataCols: ITableCol[] | undefined;
  @Input() secondButton: boolean = true;

  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);

  list$: Observable<any[]> | undefined;

  cols: ITableCol[] | null | undefined;

  role: number = 0;

  public loadingDots = '';
  public canShowButton = true;

  ngOnInit() {
    if (this.serviceMethod === 'adminGetAll') {
      this.canShowButton = false;
    }
    if (this.serviceMethod) {
      this.list$ = this.dataService[this.serviceMethod]();
    }
    this.cols = this.dataCols;
    setInterval(() => {
      this.loadingDots += '.';
      if (this.loadingDots.length > 3) {
        this.loadingDots = '';
      }
    }, 200);
    this.role = this.authService.userObject.value?.role!;
  }
}
