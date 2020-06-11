/**
 * @license
 * InfiniTag
 * Copyright (c) 2020 AMOS-5.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDocument } from '../models/IDocument.model';
import { environment } from './../../environments/environment';
import {ITaggingMethod} from '../models/ITaggingMethod';
import {ApiService} from '../services/api.service';
import {IKeyWordModel} from '../models/IKeyWordModel.model';
import {FormBuilder} from "@angular/forms";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  public title = 'infinitag';
  public serverUrl = environment.serverUrl;
  public backendStatus = `${this.serverUrl}/health`;
  public documentsUrl = `${this.serverUrl}/documents`;
  public uploadUrl = `${this.documentsUrl}/upload`;
  public downloadUrl = `${this.documentsUrl}/download`;
  public keywordModels: Array<IKeyWordModel> = [];

  public serverStatus = 'DOWN';

  public documents: Array<IDocument> = [];
  public filterString = '';



  constructor(private httpClient: HttpClient,
              private api: ApiService) {

  }

  public ngOnInit(): void {
    this.httpClient.get(this.documentsUrl)
      .subscribe((value: Array<IDocument>) => {
        this.documents = value;
      });

    this.api.getKeywordModels()
    .subscribe((data: []) => {
      this.keywordModels = data;
    });
  }

  public handleFileInput(files: FileList) {
    const file: File = files[0];
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    this.httpClient.post(this.uploadUrl, formData)
      .subscribe((response: IDocument) => {
        this.documents.push(response);
      });
  }

  public download(document: IDocument) {
    const url = `${this.downloadUrl}/${document.title}`;

    this.httpClient.get(url)
      .subscribe((response: any) => {
        console.log(response);
      });
  }
}
