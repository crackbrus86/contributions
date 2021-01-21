import React from 'react';
import { useAppContext } from '../app.context';
import * as classnames from 'classnames';

export const Filter: React.FC = () => {
    const { filter, showAreaFilter, regions, showMembership, onChangeYearFilter, onChangeAreaFilter } = useAppContext();
    return <div className='row mb-2'>
        <div className={classnames({ 'col-2': !showMembership, 'col-3': showMembership })}>
            <label className='form-label'>Фільтр за роком</label><br />
            <input value={filter.year} type='number' onChange={e => onChangeYearFilter(e.target.value)} />
        </div>
        {
            showAreaFilter &&
            <div className='col-3'>
                <label className='form-label'>Фільтр за областю</label><br />
                <select value={filter.areaId} className='form-control form-select' onChange={e => onChangeAreaFilter(e.target.value)}>
                    <option value={0}>Всі</option>
                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
            </div>
        }
    </div>
}