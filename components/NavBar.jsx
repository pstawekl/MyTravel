'use  client';

import React, { useState } from 'react';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { useUser } from '@auth0/nextjs-auth0/client';
import PageLink from './PageLink';
import AnchorLink from './AnchorLink';
import { Col, Row } from 'reactstrap';
import Link from 'next/link';
import { SearchboxUtils } from '../utils/SearchboxUtils';
import { SearchboxComponent } from './Searchbox';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="app-navbar nav-container border-0" data-testid="navbar">
      <Navbar color="transparent" light expand="md">
        <Container className='py-2'>
          <NavbarToggler className='border-0' onClick={toggle} data-testid="navbar-toggle" />
          <Collapse isOpen={isOpen} navbar>
            <Row className='w-100'>
              <Col xs="1">
                <Nav className='d-flex align-items-center h-100' navbar data-testid="navbar-items">
                  <NavItem className='h-100'>
                    <PageLink href="/" className="nav-link h-100" testId="navbar-home">
                      <b className='h-100'>MY</b>
                    </PageLink>
                  </NavItem>
                </Nav>
              </Col>
              <Col className='d-flex justify-content-center align-items-center px-5'>
                <SearchboxComponent />
              </Col>
              <Col xs="1">
                <Nav className="d-none d-md-block navbar-login h-100" navbar>
                  {!isLoading && !user && (
                    <NavItem id="qsLoginBtn" className='h-100'>
                      <Link
                        href="/api/auth/login"
                        className="login-button h-100"
                        tabIndex={0}
                        testId="navbar-login-desktop">
                        Login
                      </Link>
                    </NavItem>
                  )}
                  {user && (
                    <UncontrolledDropdown nav inNavbar data-testid="navbar-menu-desktop py-0">
                      <DropdownToggle nav caret id="profileDropDown" className='py-0'>
                        <img
                          src={user.picture}
                          alt="Profile"
                          className="nav-user-profile rounded-circle py-0"
                          width="50"
                          height="50"
                          decode="async"
                          data-testid="navbar-picture-desktop"
                        />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem header data-testid="navbar-user-desktop">
                          {user.name}
                        </DropdownItem>
                        <DropdownItem className="dropdown-profile" tag="span">
                          <PageLink href="/profile" icon="user" testId="navbar-profile-desktop">
                            Profile
                          </PageLink>
                        </DropdownItem>
                        <DropdownItem id="qsLogoutBtn">
                          <AnchorLink href="/api/auth/logout" icon="power-off" testId="navbar-logout-desktop">
                            Log out
                          </AnchorLink>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  )}
                </Nav>
                {!isLoading && !user && (
                  <Nav className="d-md-none" navbar>
                    <AnchorLink
                      href="/api/auth/login"
                      className="btn btn-primary btn-block"
                      tabIndex={0}
                      testId="navbar-login-mobile">
                      Log in
                    </AnchorLink>
                  </Nav>
                )}
              </Col>

            </Row>
            {user && (
              <Nav
                id="nav-mobile"
                className="d-md-none justify-content-between"
                navbar
                data-testid="navbar-menu-mobile">
                <NavItem>
                  <span className="user-info">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="nav-user-profile d-inline-block rounded-circle mr-3"
                      width="50"
                      height="50"
                      decode="async"
                      data-testid="navbar-picture-mobile"
                    />
                    <h6 className="d-inline-block" data-testid="navbar-user-mobile">
                      {user.name}
                    </h6>
                  </span>
                </NavItem>
                <NavItem>
                  <PageLink href="/profile" icon="user" testId="navbar-profile-mobile">
                    Profile
                  </PageLink>
                </NavItem>
                <NavItem id="qsLogoutBtn">
                  <AnchorLink
                    href="/api/auth/logout"
                    className="btn btn-link p-0"
                    icon="power-off"
                    testId="navbar-logout-mobile">
                    Log out
                  </AnchorLink>
                </NavItem>
              </Nav>
            )}
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
