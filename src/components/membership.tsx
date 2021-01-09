import React from 'react';
import { useAppContext } from '../app.context';

export const Membership: React.FC = () => {
    const { membershipRegions, onLoadMembership } = useAppContext();

    React.useEffect(() => {
        onLoadMembership();
    }, [])

    return <div className='membership'>
        {membershipRegions.length > 0 &&
            <div>
                {membershipRegions.map(region => <div key={region.id} className='alert alert-primary'>
                    {region.name}
                </div>)}
            </div>
        }
    </div>
}