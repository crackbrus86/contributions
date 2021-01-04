import React from 'react';
import ReactDOM from 'react-dom';
import { useAppContext } from '../app.context';
import './delete.member.dialog.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import * as Models from '../models';

export const DeleteMemberDialog: React.FC = () => {
    const { memberToRemove, onDeleteMember, onHideConfirm } = useAppContext();
    const onDelete = async () => {
        await onDeleteMember({ memberId: memberToRemove.memberId });
        onHideConfirm();
    }
    if(!memberToRemove) return null;
    return ReactDOM.createPortal(<div className='modal pc-modal-dialog'>
        <div className='modal-dialog'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <h5 className='modal-title'>Видалити анкету</h5>
                    <FontAwesomeIcon icon={faTimes} className='btn-close' onClick={onHideConfirm}></FontAwesomeIcon>
                </div>
                <div className='modal-body'>
                    <p>Ви точно хочете видалити цю анкету?</p>
                </div>
                <div className='modal-footer'>
                    <button type='button' className='btn btn-secondary' onClick={onHideConfirm}>Ні</button>
                    <button type='button' className='btn btn-primary' onClick={onDelete}>Так</button>
                </div>
            </div>
        </div>
    </div>, document.getElementById('portal-container'));
}