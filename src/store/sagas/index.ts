import { takeEvery } from 'redux-saga/effects';
import { CREATE_BOT } from '../actionTypes/botActionsTypes';
import { createBotSaga } from './botSagas';

export default function* rootSaga() {
    yield takeEvery(CREATE_BOT, createBotSaga);

}