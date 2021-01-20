import React from 'react';
import TableHeaders from "./TableHeaders.json";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserEdit, faSpinner, faUserSlash, faFilter } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import './members.list.scss';
import { useAppContext } from '../app.context';
import * as classnames from 'classnames';

export const MembersList: React.FC = () => {
    const {
        members,
        regions,
        filter,
        showAreaFilter,
        onAddMember,
        onEdit,
        onLoadMembersAdm,
        onChangeContributionStatus,
        onShowConfirm,
        onChangeYearFilter,
        onChangeAreaFilter,
        onResetFilter
    } = useAppContext();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [showFilter, setShowFilter] = React.useState<boolean>(false);

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
        if(showFilter) onResetFilter();
    }

    return <div className='members-list'>
        <h2>Анкети членства ФПУ</h2>
        <div className='row mb-2 mt-2'>
            <div className='col-lg'>
                <button type='button' className='btn btn-primary' onClick={onAddMember}><FontAwesomeIcon icon={faUserPlus} size='1x' /> Додати анкету</button>
                <button type='button' className={classnames('btn ml-2', { 'btn-secondary': !showFilter, 'btn-success': showFilter })} onClick={onToggleShowFilter} >
                    <FontAwesomeIcon icon={faFilter} />
                </button>
            </div>
        </div>
        {
            showFilter &&
            <div className='row mb-2'>
                <div className='col-2'>
                    <label className='form-label'>Фільтр за роком</label><br/>
                    <input value={filter.year} type='number' onChange={e => onChangeYearFilter(e.target.value)} />
                </div>
                {
                    showAreaFilter &&
                    <div className='col-3'>
                        <label className='form-label'>Фільтр за областю</label><br/>
                        <select value={filter.areaId} className='form-control form-select' onChange={e => onChangeAreaFilter(e.target.value)}>
                            <option value={0}>Всі</option>
                            {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                }
            </div>
        }
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
                                <td key='fpuDate' className='td-align-center'>{moment(member.fpuDate).format('DD/MM/YYYY')}</td>
                                <td key='otherFederationMembership' className='td-align-center'>{member.otherFederationMembership ? 'Так' : 'Ні'}</td>
                                <td key='reFpuDate' className={classnames('td-align-center', {'highlight': member.otherFederationMembership })}>{
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