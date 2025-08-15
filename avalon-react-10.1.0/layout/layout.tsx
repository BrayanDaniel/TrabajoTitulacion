'use client';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { LayoutContext } from './context/layoutcontext';
import { classNames, DomHandler } from 'primereact/utils';
import { useEventListener, useMountEffect, useResizeListener, useUnmountEffect } from 'primereact/hooks';
import { PrimeReactContext } from 'primereact/api';
import AppConfig from './AppConfig';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import AppBreadcrumb from './AppBreadCrumb';
import AppFooter from './AppFooter';
import type { AppTopbarRef, ChildContainerProps } from '@/types';
import authService from '../services/authService';

const Layout = (props: ChildContainerProps) => {
    const { layoutConfig, layoutState, setLayoutState, setLayoutConfig, isSlim, isSlimPlus, isHorizontal, isDesktop, isSidebarActive } = useContext(LayoutContext);
    const { setRipple } = useContext(PrimeReactContext);
    const topbarRef = useRef<AppTopbarRef>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    let timeout: NodeJS.Timeout | null = null;

    // Verificar autenticación al cargar
    useEffect(() => {
        if (authService.isAuthenticated()) {
            setIsAuthenticated(true);
        } else {
            // Solo redirigir al login si NO estamos en la página raíz
            if (pathname !== '/') {
                router.replace('/auth/login2');
            } else {
                setIsAuthenticated(false);
            }
        }
    }, [router, pathname]);

    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                sidebarRef.current?.isSameNode(event.target as Node) ||
                sidebarRef.current?.contains(event.target as Node) ||
                topbarRef.current?.menubutton?.isSameNode(event.target as Node) ||
                topbarRef.current?.menubutton?.contains(event.target as Node)
            );

            if (isOutsideClicked) {
                hideMenu();
            }
        }
    });

    const [bindDocumentResizeListener, unbindDocumentResizeListener] = useResizeListener({
        listener: () => {
            if (isDesktop() && !DomHandler.isTouchDevice()) {
                hideMenu();
            }
        }
    });

    const hideMenu = useCallback(() => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            overlayMenuActive: false,
            overlaySubmenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false,
            resetMenu: (isSlim() || isSlimPlus() || isHorizontal()) && isDesktop()
        }));
    }, [isSlim, isSlimPlus, isHorizontal, isDesktop]);

    const blockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    };

    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    useMountEffect(() => {
        setRipple?.(layoutConfig.ripple);
    });

    const onMouseEnter = () => {
        if (!layoutState.anchored) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                sidebarActive: true
            }));
        }
    };

    const onMouseLeave = () => {
        if (!layoutState.anchored) {
            if (!timeout) {
                timeout = setTimeout(
                    () =>
                        setLayoutState((prevLayoutState) => ({
                            ...prevLayoutState,
                            sidebarActive: false
                        })),
                    300
                );
            }
        }
    };

    useEffect(() => {
        const onRouteChange = () => {
            if (layoutConfig.colorScheme === 'dark') {
                setLayoutConfig((prevState) => ({ ...prevState, menuTheme: 'dark' }));
            }
        };
        onRouteChange();
    }, [pathname, searchParams]);

    useEffect(() => {
        if (isSidebarActive()) {
            bindMenuOutsideClickListener();
        }

        if (layoutState.staticMenuMobileActive) {
            blockBodyScroll();
            (isSlim() || isSlimPlus() || isHorizontal()) && bindDocumentResizeListener();
        }

        return () => {
            unbindMenuOutsideClickListener();
            unbindDocumentResizeListener();
            unblockBodyScroll();
        };
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive, layoutState.overlaySubmenuActive]);

    useEffect(() => {
        const onRouteChange = () => {
            hideMenu();
        };
        onRouteChange();
    }, [pathname, searchParams]);

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
    });

    // Si no está autenticado Y no estamos en la página raíz, no renderizar nada
    if ((isAuthenticated === null || !isAuthenticated) && pathname !== '/') {
        return null;
    }

    // Si estamos en la página raíz y no está autenticado, solo renderizar el contenido sin el layout de Avalon
    if (pathname === '/' && !isAuthenticated) {
        return <>{props.children}</>;
    }

    const containerClassName = classNames('layout-topbar-' + layoutConfig.topbarTheme, 'layout-menu-' + layoutConfig.menuTheme, 'layout-menu-profile-' + layoutConfig.menuProfilePosition, {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-slim': layoutConfig.menuMode === 'slim',
        'layout-slim-plus': layoutConfig.menuMode === 'slim-plus',
        'layout-horizontal': layoutConfig.menuMode === 'horizontal',
        'layout-reveal': layoutConfig.menuMode === 'reveal',
        'layout-drawer': layoutConfig.menuMode === 'drawer',
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'layout-sidebar-dark': layoutConfig.colorScheme === 'dark',
        'p-ripple-disabled': !layoutConfig.ripple,
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'layout-topbar-menu-active': layoutState.topbarMenuActive,
        'layout-menu-profile-active': layoutState.menuProfileActive,
        'layout-sidebar-active': layoutState.sidebarActive,
        'layout-sidebar-anchored': layoutState.anchored
    });

    return (
        <React.Fragment>
            <div className={classNames('layout-container', containerClassName)}>
                <AppTopbar ref={topbarRef} />
                <div ref={sidebarRef} className="layout-sidebar" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <AppSidebar />
                </div>
                <div className="layout-content-wrapper">
                    <div>
                        <AppBreadcrumb></AppBreadcrumb>
                        <div className="layout-content">{props.children}</div>
                    </div>
                    <AppFooter></AppFooter>
                </div>
                <AppConfig />
                <div className="layout-mask"></div>
            </div>
        </React.Fragment>
    );
};

export default Layout;