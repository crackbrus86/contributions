import React from 'react';
import TableHeaders from "./TableHeaders.json";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserEdit, faSpinner, faUserSlash, faFilter } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCheckSquare, faFileWord } from '@fortawesome/free-regular-svg-icons';
import './members.list.scss';
import { useAppContext } from '../app.context';
import * as classnames from 'classnames';
import { Filter } from './filter';

export const MembersList: React.FC = () => {
    const {
        members,
        filter,
        displaySmallMode,
        canExport,
        onAddMember,
        onEdit,
        onLoadMembersAdm,
        onChangeContributionStatus,
        onShowConfirm,
        onResetFilter,
        onShowExport,
    } = useAppContext();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [showFilter, setShowFilter] = React.useState<boolean>(filter.year != new Date().getFullYear() || filter.areaId !== 0);

    const onLoadMembers = async () => {
        setIsLoading(true);
        await onLoadMembersAdm();
        setIsLoading(false);
    }

    React.useEffect(() => {
        onLoadMembers()
    }, [filter])

    const onToggleShowFilter = () => {
        setShowFilter(!showFilter);
        if (showFilter) onResetFilter();
    }

    const onExport = () => {

    }

    return <div className='members-list'>
        <h2>Анкети членства ФПУ</h2>
        <div className='row mb-2 mt-2'>
            <div className='col-lg'>
                <button type='button' className='btn btn-primary' onClick={onAddMember}><FontAwesomeIcon icon={faUserPlus} size='1x' /> Додати анкету</button>
                <button type='button' className={classnames('btn ml-2', { 'btn-secondary': !showFilter, 'btn-success': showFilter })} onClick={onToggleShowFilter} >
                    <FontAwesomeIcon icon={faFilter} />
                </button>
                {canExport &&
                    <button
                        type='button'
                        className='btn btn-secondary ml-2'
                        onClick={onShowExport}
                    >
                        <FontAwesomeIcon icon={faFileWord} size='1x' /> Експорт у Word
                    </button>
                }
            </div>
        </div>
        {showFilter && <Filter />}
        <div className='row'>
            <div className='col-lg'>
                {members.length === 0 &&
                    <div className='alert alert-dark' role='alert'>
                        {!isLoading && `Не додано жодної анкети.`}
                        {isLoading && <div>Дані завантажуються... <FontAwesomeIcon icon={faSpinner} spin /></div>}
                    </div>
                }
                {members.length > 0 &&
                    <table className={classnames('table table-hover table-striped', { 'table-reduced': displaySmallMode })}>
                        <thead>
                            <tr>
                                <th key='btn1' style={{ width: '30px' }}></th>
                                <th key='btn2' style={{ width: '30px' }}></th>
                                {TableHeaders.map(header => <th key={header.id} scope='col' style={{ width: header.width }}>{header.title}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, index) => <tr key={member.memberId}>
                                <td key='btn1'>
                                    <FontAwesomeIcon
                                        icon={faUserEdit}
                                        size='1x'
                                        className='table__action-btn'
                                        onClick={() => onEdit(member)}
                                        title='Відкрити'
                                    />
                                </td>
                                <td key='btn2'>
                                    <FontAwesomeIcon
                                        icon={faUserSlash}
                                        size='1x'
                                        className='table__action-btn'
                                        onClick={() => onShowConfirm(member)}
                                        title='Видалити'
                                    />
                                </td>
                                <td key='no'>{index + 1}</td>
                                <td key='fullName'>{member.fullName}</td>
                                <td key='dateOfBirth' className='td-align-center'>{moment(member.dateOfBirth).format('DD/MM/YYYY')}</td>
                                <td key='otherFederationMembership' className='td-align-center'>{member.otherFederationMembership ? 'Так' : 'Ні'}</td>
                                <td key='reFpuDate' className={classnames('td-align-center', { 'highlight': member.otherFederationMembership })}>{
                                    member.otherFederationMembership ? moment(member.reFpuDate).format('DD/MM/YYYY') : null
                                }</td>
                                <td key='area' className='td-align-center'>{member.area}</td>
                                <td key='isContributed' className='td-align-center'>
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