'use client';

import React, { useEffect, useState } from 'react';
import { Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { UserProfile, useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Highlight from '../../components/Highlight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Footer from '../../components/Footer';
import { PaymentInfo, User } from '../../utils/dbUtils';

function Profile() {
  const { user, isLoading } = useUser();
  const [rowWidth, setRowWidth] = useState<string>('100%');
  const router = useRouter();

  useEffect(() => {
    setRowWidth(`${document.documentElement.getElementsByClassName('app-content-inside')[0].clientWidth}px`);
  }, [])

  return (
    <>
      <Row className='app-content expand'>
        <Row className='app-content-inside mx-5'>
          <Container className='nav-row' style={{width: rowWidth}} onClick={() => router.back()} >
            <Col><FontAwesomeIcon className={'nav-button'} icon={faArrowLeft}/></Col>
          </Container>
          {isLoading && <Loading />}
          {
            user && profileTabs(user)
          }
          <Row className='app-content-footer'>
            <Footer />
          </Row>
        </Row>
      </Row>
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});

function profileTabs(user: UserProfile) {
  const [activeTab, setActiveTab] = useState<'info' | 'payments' | 'bookings' | 'settings'>('info');
  function tabSwitcher() {
    switch (activeTab) {
      case 'info':
        return <UserInfoTab user={user} />
      case 'payments':
        return <PaymentsTab user={user} />
      case 'bookings':
        return <>
          <Row>
            <Col sm="12">
              <h3>Rezerwacje</h3>
            </Col>
          </Row>
        </>
      case 'settings':
        return <>
          <Row>
            <Col sm="12">
              <h3>Ustawienia konta</h3>
            </Col>
          </Row>
        </>
    }
  }

  if (user) {
    return (
      <Container className='app-content-inside-content'>
        <Row>
          <Nav
            justified
            pills
          >
            <NavItem>
              <NavLink
                active={activeTab == 'info'}
                onClick={() => setActiveTab('info')}
                role={'button'}
              >
                Informacje o koncie
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab == 'payments'}
                onClick={() => setActiveTab('payments')}
                role={'button'}>
                Płatności
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab == 'bookings'}
                onClick={() => setActiveTab('bookings')}
                role={'button'}>
                Rezerwacje
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab == 'settings'}
                onClick={() => setActiveTab('settings')}
                role={'button'}
              >
                Ustawienia konta
              </NavLink>
            </NavItem>
          </Nav>
        </Row>
        <Row>
          {tabSwitcher()}
        </Row>
      </Container>
    )
  }
}

function UserInfoTab({ user }) {
  return (
    <>
      <Row className='py-4'>
        <Col sm="12">
          <h3>Informację o użytkowniku</h3>
        </Col>
      </Row>
      {
        user.name &&
        <Row>
          <Col className='d-flex justify-content-end'>Adres e-mail:</Col>
          <Col className='d-flex justify-content-start'>{user.name}</Col>
        </Row>
      }
      {
        user.nickname &&
        <Row>
          <Col className='d-flex justify-content-end'>Nazwa użytkownika</Col>
          <Col className='d-flex justify-content-start'>{user.nickname}</Col>
        </Row>
      }
      {
        user.sub &&
        <Row>
          <Col className='d-flex justify-content-end'>Id użytkownika:</Col>
          <Col className='d-flex justify-content-start'>{user.sub}</Col>
        </Row>
      }
      {
        user.updated_at &&
        <Row>
          <Col className='d-flex justify-content-end'>Data edycji:</Col>
          <Col className='d-flex justify-content-start'>{user.updated_at}</Col>
        </Row>
      }
    </>
  );
}

function PaymentsTab({ user }) {
  const [formData, setFormData] = useState<PaymentInfo>({
    id: 0,
    user_id: 0,
    billing_city_id: 0,
    billing_country_code: '',
    billing_house_number: '',
    billing_post_code: '',
    card_number: 0,
    CVV: '',
    expiration_date: '',
  });

  useEffect(() => {
    fetch('/api/pg/get-payment-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: user })
    }).then(response => response.json())
      .then(data => {
        console.log('userInfo', data.userInfo);
        setFormData({
          id: data.id,
          user_id: data.user_id,
          billing_city_id: data.billing_city_id,
          billing_country_code: data.billing_country_code,
          billing_house_number: data.billing_house_number,
          billing_post_code: data.billing_post_code,
          card_number: data.card_number,
          CVV: data.CVV,
          expiration_date: data.expiration_date,
        })
      })
  }, [])


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/pg/update-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: formData, user: user })
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="card_number">Numer karty</Label>
        <Input type="number" name="card_number" style={{ appearance: 'none' }} id="card_number" value={formData.card_number} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="CVV">CVV</Label>
        <Input type="text" name="CVV" id="CVV" value={formData.CVV} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="expiration_date">Data ważności</Label>
        <Input type="text" name="expiration_date" id="expiration_date" value={formData.expiration_date} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="billing_country_code">Kraj</Label>
        <Input type="select" name="billing_country_code" id="billing_country_code" value={formData.billing_country_code} onChange={handleChange}>
          {/* {Object.entries(countryList[0]).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))} */}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="billing_city_id">Miasto</Label>
        <Input type="text" name="billing_city_id" id="billing_city_id" value={formData.billing_city_id} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="billing_house_number">Numer domu/mieszkania</Label>
        <Input type="text" name="billing_house_number" id="billing_house_number" value={formData.billing_house_number} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="billing_post_code">Kod pocztowy</Label>
        <Input type="text" name="billing_post_code" id="billing_post_code" value={formData.billing_post_code} onChange={handleChange} />
      </FormGroup>
      <Button type="submit">Submit</Button>
    </Form>
  );
}

function UserSettingsTab({ user }) {
  const [formData, setFormData] = useState<User>({
    country: '',
    auth0_id: '',
    email: '',
    id: 0,
    name: '',
    nickname: '',
    birth_date: '',
    surname: '',
    city_id: 0,
    street: '',
    house_number: '',
    post_code: '',
    phone_number: '',
    phone_country: ''
  });
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    fetch('/api/pg/get-user-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: user })
    }).then(response => response.json())
      .then(data => {
        console.log('userInfo', data.userInfo);
        setFormData({
          city_id: data.city_id,
          country: data.country,
          house_number: data.house_number,
          phone_number: data.phone_number,
          phone_country: data.phone_country,
          post_code: data.post_code,
          street: data.street,
          auth0_id: data.auth0_id,
          email: data.email,
          id: data.id,
          name: data.name,
          nickname: data.nickname,
          birth_date: data.birth_date,
          surname: data.surname,
        })
      })
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/pg/update-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData: formData, user: user })
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="country">Państwo</Label>
        <Input type="select" name="country" id="country" value={formData.country} onChange={handleChange}>
          {/* {Object.entries(countryList[0]).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))} */}
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="city_id">Miasto</Label>
        <Input type="text" name="city_id" id="city_id" value={formData.city_id} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="street">Ulica</Label>
        <Input type="text" name="street" id="street" value={formData.street} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="house_number">Numer domu/mieszkania</Label>
        <Input type="text" name="house_number" id="house_number" value={formData.house_number} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label for="post_code">Kod pocztowy</Label>
        <Input type="text" name="post_code" id="post_code" value={formData.post_code} onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Input type="select" name="phone_country" id="phone_country" value={formData.phone_country} onChange={handleChange} />
        <Label for="phone_number">Telefon</Label>
        <Input type="text" name="phone_number" id="phone_number" value={formData.phone_number} onChange={handleChange} />
      </FormGroup>
      <Button type="submit">Submit</Button>
    </Form>
  );
}