import { Router } from 'express';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';

import uploadConfig from '../config/upload';
import * as DeviceController from '../controller/deviceController';
import { encryptSession } from '../controller/encryptController';
import * as MessageController from '../controller/messageController';
import * as SessionController from '../controller/sessionController';
import verifyToken from '../middleware/auth';
import * as HealthCheck from '../middleware/healthCheck';
import statusConnection from '../middleware/statusConnection';
import swaggerDocument from '../swagger.json';

const upload = multer(uploadConfig as any) as any;
const routes: Router = Router();

// Generate Token
routes.post('/api/:session/:secretkey/generate-token', encryptSession);

// All Sessions
routes.get(
  '/api/:secretkey/show-all-sessions',
  SessionController.showAllSessions
);
routes.post('/api/:secretkey/start-all', SessionController.startAllSessions);

// Sessions
routes.get(
  '/api/:session/check-connection-session',
  verifyToken,
  SessionController.checkConnectionSession
);
routes.get(
  '/api/:session/get-media-by-message/:messageId',
  verifyToken,
  SessionController.getMediaByMessage
);
routes.get(
  '/api/:session/qrcode-session',
  verifyToken,
  SessionController.getQrCode
);
routes.post(
  '/api/:session/start-session',
  verifyToken,
  SessionController.startSession
);
routes.post(
  '/api/:session/logout-session',
  verifyToken,
  statusConnection,
  SessionController.logOutSession
);
routes.post(
  '/api/:session/close-session',
  verifyToken,
  SessionController.closeSession
);
routes.get(
  '/api/:session/status-session',
  verifyToken,
  SessionController.getSessionState
);

// Messages
routes.post(
  '/api/:session/send-message',
  verifyToken,
  statusConnection,
  MessageController.sendMessage
);
routes.post(
  '/api/:session/edit-message',
  verifyToken,
  statusConnection,
  MessageController.editMessage
);
routes.post(
  '/api/:session/send-image',
  upload.single('file'),
  verifyToken,
  statusConnection,
  MessageController.sendFile
);
routes.post(
  '/api/:session/send-reply',
  verifyToken,
  statusConnection,
  MessageController.replyMessage
);
routes.post(
  '/api/:session/send-file',
  upload.single('file'),
  verifyToken,
  statusConnection,
  MessageController.sendFile
);
routes.post(
  '/api/:session/send-file-base64',
  verifyToken,
  statusConnection,
  MessageController.sendFile
);
routes.post(
  '/api/:session/send-voice',
  verifyToken,
  statusConnection,
  MessageController.sendVoice
);
routes.post(
  '/api/:session/send-voice-base64',
  verifyToken,
  statusConnection,
  MessageController.sendVoice64
);

// Health Check
routes.get('/healthz', HealthCheck.healthz);
routes.get('/unhealthy', HealthCheck.unhealthy);

//Metrics Prometheus
//routes.get('/metrics', HealthCheck.metrics);

// Api Doc
routes.use('/api-docs', swaggerUi.serve as any);
routes.get('/api-docs', swaggerUi.setup(swaggerDocument) as any);

export default routes;
