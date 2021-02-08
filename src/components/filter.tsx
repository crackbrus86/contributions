import React from 'react';
import { useAppContext } from '../app.context';
import * as classnames from 'classnames';

export const Filter: React.FC = () => {
    const {
        filter,
        showAreaFilter,
        regions,
        showRefereeFilter,
        onChangeYearFilter,
        onChangeAreaFilter,
        onChangeOnlyRefereeFilter 
    } = useAppContext();
    return <div className='row mb-2'>
        <div className='col-4'>
            <label className='form-label'>Фільтр за роком</label><br />
            <input value={filter.year} type='number' onChange={e => onChangeYearFilter(e.target.value)} />
        </div>
        {
            showAreaFilter &&
            <div className='col-4'>
                <label className='form-label'>Фільтр за областю</label><br />
                <select value={filter.areaId} className='form-control form-select' onChange={e => onChangeAreaFilter(e.target.value)}>
                    <option value={0}>Всі</option>
                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
            </div>
        }
        {
            showRefereeFilter && 
            <div className='col-4'>
                <label className='form-check-label'>Показувати лише суддів</label>
                <div className='mt-2'>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        value=''
                        checked={filter.onlyReferees}
                        onChange={onChangeOnlyRefereeFilter}
                    />
                </div>
            </div>
        }
    </div>
}