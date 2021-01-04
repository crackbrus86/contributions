import React from 'react';
import * as Models from '../models';
import TableHeaders from "./TableHeaders.json";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserEdit, faSpinner, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import './members.list.scss';
import {useAppContext} from '../app.context';

export const MembersList: React.FC = () => {
    const { members, onAddMember, onEdit, onLoadMembersAdm, onChangeContributionStatus, onShowConfirm } = useAppContext();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const onLoadMembers = async () => {
        setIsLoading(true);
        await onLoadMembersAdm();
        setIsLoading(false);
    }

    React.useEffect(() => {
        onLoadMembers()
    }, [])

    return <div className='members-list'>
        <h2>Внески членів ФПУ</h2>
        <div className='row mb-2 mt-2'>
            <div className='col-lg'>
                <button type='button' className='btn btn-primary' onClick={onAddMember}><FontAwesomeIcon icon={faUserPlus} size='1x' /> Додати персону</button>
            </div>
        </div>
        <div className='row'>
            <div className='col-lg'>
                {members.length === 0 &&
                    <div className='alert alert-dark' role='alert'>
                        {!isLoading && `Не додано жодної персони.`}
                        {isLoading && <div>Дані завантажуються... <FontAwesomeIcon icon={faSpinner} spin /></div>}
                    </div>
                }
                {members.length > 0 &&
                    <table className='table table-hover table-striped'>
                        <thead>
                            <tr>
                                <th key='btn1'></th>
                                <th key='btn2'></th>
                                {TableHeaders.map(header => <th key={header.id} scope='col'>{header.title}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, index) => <tr key={member.memberId}>
                                <td key='btn1'><FontAwesomeIcon icon={faUserEdit} size='2x' className='table__action-btn' onClick={() => onEdit(member)} /></td>
                                <td key='btn2'><FontAwesomeIcon icon={faUserSlash} size='2x' className='table__action-btn' onClick={() => onShowConfirm(member)} /></td>
                                <td key='no'>{index + 1}</td>
                                <td key='fullName'>{member.fullName}</td>
                                <td key='dateOfBirth'>{moment(member.dateOfBirth).format('DD/MM/YYYY')}</td>
                                <td key='citizenship'>{member.citizenship}</td>
                                <td key='id'>{member.id}</td>
                                <td key='passport'>{member.passport}</td>
                                <td key='address'>{member.address}</td>
                                <td key='phone'>{member.phone}</td>
                                <td key='email'>{member.email}</td>
                                <td key='otherFederationMembership'>{member.otherFederationMembership ? 'Так' : 'Ні'}</td>
                                <td key='fpuDate'>{moment(member.fpuDate).format('DD/MM/YYYY')}</td>
                                <td key='area'>{member.area}</td>
                                <td key='isContributed'>
                                    <FontAwesomeIcon
                                        className='table__action-icon'
                                        icon={member.isContributed ? faCheckSquare : faSquare}
                                        size='2x'
                                        onClick={() => onChangeContributionStatus(member)}
                                    />
                                </td>
                            </tr>)}
                        </tbody>
                    </table>}
            </div>
        </div>
    </div>
}