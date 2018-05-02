//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Framework Emulator Github:
// https://github.com/Microsoft/BotFramwork-Emulator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import * as HttpStatus from 'http-status-codes';
import { RequestHandler, Server } from 'restify';

import BotEmulator from '../botEmulator';
import createBotFrameworkAuthenticationMiddleware from '../utils/botFrameworkAuthentication';
import createJsonBodyParserMiddleware from '../utils/jsonBodyParser';
import getBotEndpoint from '../middleware/getBotEndpoint';

import getToken from './middleware/getToken';
import emulateOAuthCards from './middleware/emulateOAuthCards';
import signOut from './middleware/signOut';
import tokenResponse from './middleware/tokenResponse';

export default function registerRoutes(botEmulator: BotEmulator, server: Server, uses: RequestHandler[]) {
  const jsonBodyParser = createJsonBodyParserMiddleware();
  const verifyBotFramework = createBotFrameworkAuthenticationMiddleware(botEmulator.options.fetch);
  const botEndpoint = getBotEndpoint(botEmulator);

  server.get(
    '/api/usertoken/GetToken',
    verifyBotFramework,
    botEndpoint,
    getToken(botEmulator)
  );

  server.post(
    '/api/usertoken/emulateOAuthCards',
    verifyBotFramework,
    emulateOAuthCards(botEmulator)
  );

  server.del(
    '/api/usertoken/SignOut',
    verifyBotFramework,
    botEndpoint,
    signOut(botEmulator)
  );

  server.post(
    '/api/usertoken/tokenResponse',
    ...uses,
    jsonBodyParser,
    tokenResponse(botEmulator)
  );
}