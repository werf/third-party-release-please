// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Update, UpdateOptions, VersionsMap} from './update';
import {GitHubFileContents} from '../github';
import {logger} from '../util/logger';

export class RootComposerUpdatePackage implements Update {
  path: string;
  changelogEntry: string;
  version: string;
  versions?: VersionsMap;
  packageName: string;
  create: boolean;
  contents?: GitHubFileContents;

  constructor(options: UpdateOptions) {
    this.create = false;
    this.path = options.path;
    this.changelogEntry = options.changelogEntry;
    this.version = options.version;
    this.versions = options.versions;
    this.packageName = options.packageName;
  }

  updateContent(content: string): string {
    if (!this.versions || this.versions.size === 0) {
      logger.info(`no updates necessary for ${this.path}`);
      return content;
    }
    const parsed = JSON.parse(content);
    if (this.versions) {
      // eslint-disable-next-line prefer-const
      for (let [key, version] of this.versions.entries()) {
        version = version || '1.0.0';
        logger.info(`updating ${key} from ${parsed[key]} to ${version}`);
        parsed[key] = version;
      }
    }
    return JSON.stringify(parsed, null, 4) + '\n';
  }
}
