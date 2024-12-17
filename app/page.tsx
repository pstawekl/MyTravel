'use client';

import React, { useEffect } from 'react';
import HomeContent from '../components/Content';
import Footer from '../components/Footer';
import { Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { City, SearchboxUtils } from '../utils/SearchboxUtils';

export default function Index() {
  const [isExpand, setIsExpand] = React.useState<boolean>(false);
  const [expandRowWidth, setExpandRowWidth] = React.useState<string>('100%');

  useEffect(() => {
    setExpandRowWidth(`${document.getElementsByClassName('app-content-inside')[0].clientWidth}px`);
    SearchboxUtils.fetchSearchboxList();
  }, []);

  return (
    <>
      <Row className={'app-content ' + (isExpand ? 'expand' : '')}>
        <Row className='app-content-inside mx-5'>
          <Row className='expand-button-row' style={{width: expandRowWidth}} onClick={() => setIsExpand(!isExpand)}>
            <FontAwesomeIcon
              className="expand-button"
              icon={!isExpand ? faArrowUp : faArrowDown}
              onClick={() => setIsExpand(!isExpand)}
              style={{ fontSize: '2rem' }} />
          </Row>
          <Row className='app-content-container'><HomeContent /></Row>
          <Row className='app-content-footer mx-5'><Footer /></Row>
        </Row>
      </Row>
    </>
  );
}
