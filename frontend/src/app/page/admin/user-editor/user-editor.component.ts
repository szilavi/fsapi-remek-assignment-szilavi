import { Component, inject } from '@angular/core';
import { ConfigService } from 'src/app/service/config.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss'],
})
export class UserEditorComponent {
  config: ConfigService = inject(ConfigService);
  userService: UserService = inject(UserService);
}
