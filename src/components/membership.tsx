import React from 'react';
import * as moment from 'moment';
import { useAppContext } from '../app.context';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import './membership.scss';
import * as classnames from 'classnames';
import { Filter } from './filter';

export const Membership: React.FC = () => {
    const { regions, membershipData, filter, onLoadMembership, onResetFilter } = useAppContext();
    const [showFilter, setShowFilter] = React.useState<boolean>(filter.year != new Date().getFullYear() || filter.areaId !== 0);

    React.useEffect(() => {
        onLoadMembership();
    }, [filter]);

    const onToggleShowFilter = () => {
        setShowFilter(!showFilter);
        if(showFilter) onResetFilter();
    }

    return <div className='membership'>
        <div className='mb-3 row'>
            <button type='button' className={classnames('btn ml-2', { 'btn-secondary': !showFilter, 'btn-success': showFilter })} onClick={onToggleShowFilter} >
                <FontAwesomeIcon className='mr-2' icon={faFilter} />Фільтрувати
            </button>
        </div>
        {showFilter && <Filter />}
        <div className='row'>
            <div className='col-lg'>
                {!membershipData.length && <div className='alert alert-dark' role='alert'>Немає даних по цій області.</div>}
                {!!membershipData.length && 
                    <table  className='table table-hover table-striped'>
                        <thead>
                            <tr>
                                <th style={{width: '45px'}}>№</th>
                                <th>П.І.П</th>
                                <th style={{width: '140px'}}>Дата народження</th>
                                <th style={{width: '180px'}}>Область</th>
                                <th style={{width: '85px'}}>Внесок сплачено</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                membershipData.map((x, index) => <tr key={x.memberId}>
                                    <td key='1'>{++index}</td>
                                    <td key='2'>{x.fullName}</td>
                                    <td key='3' className='td-align-center'>{moment(x.dateOfBirth).format('DD/MM/YYYY')}</td>
                                    <td key='5' className='td-align-center'>{x.area}</td>
                                    <td key='6' className='td-align-center'>
                                        <FontAwesomeIcon
                                            icon={x.isContributed ? faCheckSquare : faSquare}
                                            size='2x'
                                        />
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                }
            </div>
        </div>
    </div>
}