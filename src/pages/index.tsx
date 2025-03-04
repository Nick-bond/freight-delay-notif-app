import type { ReactElement } from 'react';
import TrafficComponent from '../app/components/traffic';
import '../app/globals.css';
const Page = () => {
    return <p>hello world</p>
}

Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <div>
          <div className='w-1/2'>
              <TrafficComponent />
          </div>
        </div>
    )
}

export default Page