import React from 'react';
import * as Models from '../models';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './member.details.scss';
import { useAppContext } from '../app.context';
import { toast } from 'react-toastify';
import * as classnames from 'classnames';
import MaskedInput from 'react-text-mask';
import * as Lookups from './Lookups.json';
import * as moment from 'moment';

const defaultMember: Models.Member = {
	memberId: null,
	fullName: '',
	dateOfBirth: new Date(),
	citizenship: '',
	id: null,
	passport: '',
	address: '',
	phone: null,
	email: '',
	job: '',
	position: '',
	jobAddress: '',
	otherFederationMembership: false,
	fpuDate: new Date(),
	area: '',
	areaId: null,
	isContributed: false
}

export const MemberDetails: React.FC = () => {
	const { member: currentMember, regions, credentials, filter, onBack, onCreateMember, onUpdateMember } = useAppContext();
	const [member, setMemeber] = React.useState<Models.Member>(currentMember ||
	{
		...defaultMember,
		areaId: credentials.appType === 'region' ? credentials.uid : filter.areaId
	});

	const onMemberUpdate = (key: keyof Models.Member, value: string | number | Date | [Date, Date] | boolean) => {
		const nextMember = { ...member, [key]: value };

		if(key === 'lastAlterEventDate')
			nextMember.reFpuDate = nextMember.lastAlterEventDate ? moment(nextMember.lastAlterEventDate).add(1, 'y').toDate() : null;
			
		if(key === 'otherFederationMembership' && !value) {
			nextMember.lastAlterEventDate = new Date(null);
			nextMember.reFpuDate = new Date(null);
		}

		setMemeber(nextMember);
	}

	const onSave = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!member.memberId) {
			const addStatus = await onCreateMember(member);
			if (addStatus){
				if(member.otherFederationMembership && !defaultMember.otherFederationMembership)
					toast.warning('Повторне набуття членства фпу відбувається з дозволу президії фпу');
				onBack();
			}
			else
				toast.error('Помилка збереження. Форма містить не валідні поля.');
		} else {
			const updateStatus = await onUpdateMember(member);
			if (updateStatus){
				toast.success('Зміни збережені.');
				if(member.otherFederationMembership && !currentMember.otherFederationMembership)
					toast.warning('Повторне набуття членства фпу відбувається з дозволу президії фпу');
			}
			else
				toast.error('Помилка збереження. Форма містить не валідні поля.');
		}
	}

	return <div className='member-details'>
		<h2>{`${currentMember ? 'Редагувати' : 'Створити'} анкету`}</h2>
		<div className='row mb-2 mt-2'>
			<div className='col-lg'>
				<button type='button' className='btn btn-primary' onClick={onBack}><FontAwesomeIcon icon={faArrowLeft} size='1x' /> Назад</button>
			</div>
		</div>
		<form onSubmit={e => onSave(e)}>
			<div className='mb-3'>
				<label className='form-label'>Прізвище, ім'я, по батькові</label>
				<input
					type='text'
					className={classnames('form-control', { 'is-invalid': !member.fullName })}
					value={member.fullName}
					onChange={e => onMemberUpdate('fullName', e.target.value)}

				/>
				{
					!member.fullName &&
					<div className='invalid-feedback'>
						Прізвище, ім'я, по батькові є обов'язковим полем!
					</div>
				}
			</div>
			<div className='mb-3 row'>
				<div className='col'>
					<label className='form-label'>Дата народження</label><br />
					<DatePicker
						className={classnames('form-control', { 'is-invalid': !member.dateOfBirth || !(member.dateOfBirth instanceof Date) })}
						selected={member.dateOfBirth}
						showYearDropdown
						showMonthDropdown
						dateFormat='dd/MM/yyyy'
						onChange={date => onMemberUpdate('dateOfBirth', date)}
					/>
				</div>
				<div className='col'>
					<label className='form-label'>Дата вступу до ФПУ</label><br />
					<DatePicker
						className={classnames('form-control', { 'is-invalid': !member.fpuDate || !(member.fpuDate instanceof Date) })}
						selected={member.fpuDate}
						showYearDropdown
						showMonthDropdown
						dateFormat='dd/MM/yyyy'
						onChange={date => onMemberUpdate('fpuDate', date)}
					/>
				</div>
				<div className='col'>
					<label className='form-label'>Область</label>
					<select
						className={classnames('form-select', 'form-control', { 'is-invalid': !member.areaId })}
						value={member.areaId || ''}
						onChange={e => onMemberUpdate('areaId', e.target.value)}
						disabled={credentials.appType === 'region'}
					>
						<option key='0'></option>
						{regions.map(region => <option key={region.id} value={region.id}>{region.name}</option>)}
					</select>
					{
						!member.areaId &&
						<div className='invalid-feedback'>
							Область є обов'язковим полем!
						</div>
					}
				</div>

			</div>
			<div className='row mb-3'>
				<div className='col'>
					<label className='form-label'>Громадянство</label>
					<input
						type='text'
						className={classnames('form-control', { 'is-invalid': !member.citizenship })}
						value={member.citizenship}
						onChange={e => onMemberUpdate('citizenship', e.target.value)}
					/>
					{
						!member.citizenship &&
						<div className='invalid-feedback'>
							Громадянство є обов'язковим полем!
						</div>
					}
				</div>
				<div className='col'>
					<label className='form-label'>Ідентифікаційний номер</label>
					<input
						type='text'
						className={classnames('form-control', { 'is-invalid': !member.id })}
						value={member.id || ''}
						maxLength={12}
						onChange={e => onMemberUpdate('id', e.target.value)}
					/>
					{
						!member.id &&
						<div className='invalid-feedback'>
							Ідентифікаційний номер є обов'язковим полем!
						</div>
					}
				</div>
				<div className='col'>
					<label className='form-label'>Паспорт №, де і ким виданий</label>
					<textarea
						className={classnames('form-control', { 'is-invalid': !member.passport })}
						rows={3}
						value={member.passport}
						onChange={e => onMemberUpdate('passport', e.target.value)}
					></textarea>
					{
						!member.passport &&
						<div className='invalid-feedback'>
							Паспорт №, де і ким виданий є обов'язковим полем!
						</div>
					}
				</div>
			</div>
			<div className='mb-3 row'>
				<div className='col'>
					<label className='form-label'>Контактні телефони, факс</label>
					<div className='input-group'>
						<span className='input-group-text' id='member-phone'>+38</span>
						<MaskedInput
							placeholder='(XXX) XXX-XXXX'
							className={classnames('form-control', { 'is-invalid': !member.phone })}
							value={member.phone || ''}
							onChange={e => onMemberUpdate('phone', e.target.value)}
							mask={['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
						/>
						{
							!member.phone &&
							<div className='invalid-feedback'>
								Контактні телефони, факс є обов'язковим полем!
							</div>
						}
					</div>
				</div>
				<div className='col'>
					<label className='form-label'>Електронна адреса</label>
					<input
						type='email'
						className='form-control'
						placeholder='name@example.com'
						value={member.email}
						onChange={e => onMemberUpdate('email', e.target.value)}
					/>
				</div>
				<div className='col'>
					<label className='form-label'>Домашня адреса</label>
					<textarea className='form-control' rows={3} value={member.address} onChange={e => onMemberUpdate('address', e.target.value)} ></textarea>
				</div>
			</div>
			<div className='mb-3 row'>
				<div className='col'>
					<label className='form-label'>Місце роботи або навчання</label>
					<input type='text' className='form-control' value={member.job} onChange={e => onMemberUpdate('job', e.target.value)} />
				</div>
				<div className='col'>
					<label className='form-label'>Посада або курс</label>
					<input type='text' className='form-control' value={member.position} onChange={e => onMemberUpdate('position', e.target.value)} />
				</div>
				<div className='col'>
					<label className='form-label'>Адреса місця роботи або навчання</label>
					<textarea className='form-control' rows={3} value={member.jobAddress} onChange={e => onMemberUpdate('jobAddress', e.target.value)} ></textarea>
				</div>
			</div>
			<div className='mb-3 row'>
				<div className='col'>
					<label className='form-label'>Розряд</label>
					<select
						className='form-select form-control'
						value={member.class || ''}
						onChange={e => onMemberUpdate('class', e.target.value)}>
						<option key='0'></option>
						{Lookups.classes.map(cl => <option key={cl.id} value={cl.id}>{cl.title}</option>)}
					</select>
				</div>
				<div className='col'>
					<label className='form-label'>Звання</label>
					<select
						className='form-select form-control'
						value={member.rank || ''}
						onChange={e => onMemberUpdate('rank', e.target.value)}>
						<option key='0'></option>
						{Lookups.ranks.map(rn => <option key={rn.id} value={rn.id}>{rn.title}</option>)}
					</select>
				</div>
				<div className='col'>
					<label className='form-label'>Суддівська категорія</label>
					<select
						className='form-select form-control'
						value={member.refereeCategory || ''}
						onChange={e => onMemberUpdate('refereeCategory', e.target.value)}>
						<option key='0'></option>
						{Lookups.refereeCategories.map(rc => <option key={rc.id} value={rc.id}>{rc.title}</option>)}
					</select>
				</div>
			</div>
			<div className='mb-4 row'>
				<div className='col-md-4'>
					<div className={classnames('form-check', { 'reg-fix': credentials.appType === 'region' })}>
						<input
							className='form-check-input'
							type='checkbox'
							checked={member.otherFederationMembership}
							onChange={() => onMemberUpdate('otherFederationMembership', !member.otherFederationMembership)}
						/>
						<label className='form-check-label'>
							Членство в інших федераціях
						</label>
					</div>
				</div>
				{
					member.otherFederationMembership &&
					<>
						<div className='col-md-4'>
							<label className='form-label'>Дата останньої участі у заходах інших федерацій</label><br />
							<DatePicker
								className={classnames('form-control', 
									{ 'is-invalid': !!member.otherFederationMembership && (!member.lastAlterEventDate || !(member.lastAlterEventDate instanceof Date)) }
								)}
								selected={member.lastAlterEventDate}
								showYearDropdown
								showMonthDropdown
								dateFormat='dd/MM/yyyy'
								onChange={date => onMemberUpdate('lastAlterEventDate', date)}
							/>
						</div>
						<div className='col-md-4'>
							<label className='form-label'>Дата повторного набуття членства</label><br />
							<DatePicker
								className={classnames('form-control')}
								selected={member.reFpuDate}
								disabled
								dateFormat='dd/MM/yyyy'
								onChange={date => onMemberUpdate('lastAlterEventDate', date)}
							/>
						</div>
					</>
				}
			</div>
			<div className='mb-4 row'>
				<div className='col'>
					<div className={classnames('form-check', { 'reg-fix': credentials.appType === 'region' })}>
						<input
							className='form-check-input'
							type='checkbox'
							checked={member.isContributed}
							onChange={() => onMemberUpdate('isContributed', !member.isContributed)}
						/>
						<label className='form-check-label'>
							Внесок сплачено (за {filter.year} рік)
						</label>
					</div>
				</div>
			</div>
			<div>
				<button type='submit' className='btn btn-success'><FontAwesomeIcon icon={faSave} size='1x' /> Зберегти</button>
			</div>
		</form>
	</div>
}