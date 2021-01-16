import React from 'react';
import * as moment from 'moment';
import { useAppContext } from '../app.context';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './membership.scss';

export const Membership: React.FC = () => {
    const { regions, membershipData, onLoadMembership } = useAppContext();
    const [currentRegionId, setCurrentRegionId] = React.useState<number>(0);

    React.useEffect(() => {
        onLoadMembership();
    }, []);

    React.useEffect(() => {
        if(!currentRegionId && !!regions[0])
            setCurrentRegionId(regions[0].id)
    }, [regions, currentRegionId]);

    const membership = React.useMemo(() => {
        return membershipData.filter(x => x.areaId == currentRegionId);
    }, [currentRegionId, membershipData]);

    return <div className='membership'>
        <div className='mb-3 row'>
            <label>Область</label>
            <select value={currentRegionId} className='form-control form-select' onChange={e => setCurrentRegionId(parseInt(e.target.value))}>
                {regions.map(region => <option key={region.id} value={region.id}>{region.name}</option>)}
            </select>
        </div>
        <div className='row'>
            <div className='col-lg'>
                {!membership.length && <div className='alert alert-dark' role='alert'>Немає даних по цій області.</div>}
                {!!membership.length && 
                    <table  className='table table-hover table-striped'>
                        <thead>
                            <tr>
                                <th style={{width: '45px'}}>№</th>
                                <th>П.І.П</th>
                                <th style={{width: '140px'}}>Дата народження</th>
                                <th style={{width: '140px'}}>Дата вступу до ФПУ</th>
                                <th style={{width: '180px'}}>Область</th>
                                <th style={{width: '85px'}}>Внесок сплачено</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                membership.map((x, index) => <tr key={x.memberId}>
                                    <td key='1'>{++index}</td>
                                    <td key='2'>{x.fullName}</td>
                                    <td key='3' className='td-align-center'>{moment(x.dateOfBirth).format('DD/MM/YYYY')}</td>
                                    <td key='4' className='td-align-center'>{moment(x.fpuDate).format('DD/MM/YYYY')}</td>
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