import React from 'react';
import ReactDOM from 'react-dom';
import { useAppContext } from '../app.context';
import * as moment from 'moment';

export const ExportPreviewDialog: React.FC = () => {
    const { members, showExport, onHideExport } = useAppContext();

    React.useEffect(() => {
        if(!showExport) return null;
        let header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" ' + 
        'xmlns:w="urn:schemas-microsoft-com:office:word" ' + 
        'xmlns="http://www.w3.org/TR/REC-html40">' + 
        '<head><meta charset="utf-8"><title>Export HTML to Word Document with JavaScript</title></head><body>';
        let footer = '</body></html>';
        let sourceHTML = header + document.getElementById('source-html').innerHTML + footer;

        let source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        let fileDownload = document.createElement('a');
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = `fpu-membership-${moment(new Date()).format('DD-MM-YYYY hh:mm:ss')}.docx`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
        onHideExport();
    }, [showExport]);

    if(!showExport) return null;
    return ReactDOM.createPortal(<div className='modal pc-modal-dialog' onClick={onHideExport}>
    <div className='modal-dialog modal-xl'>
        <div className='modal-content'>
            <div className='modal-body' id='source-html'>
            {!members.length && <div className='alert alert-dark' role='alert'>Немає даних по цій області.</div>}
                {!!members.length && 
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
                                members.map((x, index) => <tr key={x.memberId}>
                                    <td key='1'>{++index}</td>
                                    <td key='2'>{x.fullName}</td>
                                    <td key='3' className='td-align-center'>{moment(x.dateOfBirth).format('DD/MM/YYYY')}</td>
                                    <td key='5' className='td-align-center'>{x.area}</td>
                                    <td key='6' className='td-align-center'>{ x.isContributed ? 'Taк' : 'Hі' }</td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                }
            </div>
        </div>
    </div>
</div>, document.getElementById('portal-container'));
}