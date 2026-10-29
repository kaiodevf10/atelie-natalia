import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import { Home, Services, ServiceDetails, Portfolio, Courses, About, Studio, FAQ, BookingPage, NotFound } from './pages/Pages';
import './styles/index.css';
const router = createBrowserRouter([{ element: <Layout />, children: [{ index: true, element: <Home /> }, { path: 'servicos', element: <Services /> }, { path: 'servicos/:slug', element: <ServiceDetails /> }, { path: 'noivas', element: <Navigate to="/servicos" replace /> }, { path: 'equipe', element: <Navigate to="/" replace /> }, { path: 'portfolio', element: <Portfolio /> }, { path: 'cursos', element: <Courses /> }, { path: 'sobre', element: <About /> }, { path: 'espaco', element: <Studio /> }, { path: 'faq', element: <FAQ /> }, { path: 'agendar', element: <BookingPage /> }, { path: '*', element: <NotFound /> }] }]);
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><RouterProvider router={router}/></React.StrictMode>);
