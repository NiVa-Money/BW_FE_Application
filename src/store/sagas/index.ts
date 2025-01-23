import { takeEvery, takeLatest } from 'redux-saga/effects';
import { CREATE_BOT } from '../actionTypes/botActionsTypes';
import { createBotSaga } from './botSagas';
import { CREATE_WHATSAPP_CAMPAIGN } from '../actionTypes/whatsappCampaignTypes';
import { createWhatsAppCampaignSaga } from './whatsappCampaignSaga';

export default function* rootSaga() {
    yield takeEvery(CREATE_BOT, createBotSaga);
    yield takeLatest(CREATE_WHATSAPP_CAMPAIGN, createWhatsAppCampaignSaga);
}