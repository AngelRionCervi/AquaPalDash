<script lang="ts">
  import '../resets.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import menuRoutes from '$lib/data/navMenu';
  import Footer from '$lib/components/Footer/Footer.svelte';
  import Header from '$lib/components/Header/Header.svelte';
  import Modal from '$lib/components/Modal/Modal.svelte';
  import configStore from '$lib/stores/configStore.svelte';
  import controllerStore from '$lib/stores/controllerStore.svelte';
  import bluetoothStore from '$lib/stores/bluetoothStore.svelte';
  import InitLoadingBackdrop from '$lib/components/Backdrop/InitLoadingBackdrop.svelte';
  import authStore from '$lib/stores/authStore.svelte';
  import windowStore from '$lib/stores/windowStore.svelte';
  import modalStore from '$lib/stores/modalStore.svelte';
  import deviceStatusStore from '$lib/stores/deviceStatusStore.svelte';
  import WSClientHandler, { sendWSMessage } from '$lib/wsClient/WSClientHandler';
  import { DASH_CALL_TYPES } from '$wsGlobal/callTypes';
  import { TIMEOUT_FETCH_CONFIG } from '$lib/constants';
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import monitoringStore from '$lib/stores/monitoringStore.svelte';

  const { children } = $props();
  const { toggle } = modalStore;

  let mainLoading = $state(false);
  let noConfigFetch = $state(false);
  let historicalQueried = $state(false);
  let noWsConnection = $state(false);

  function getCurrentPageTitle() {
    return menuRoutes.find(({ route }) => route === $page.url?.pathname)?.label || 'Home';
  }

  async function onNewLogin(email: string, password: string, rememberMe: boolean, demoMode: boolean) {
    const userExists = await authStore.checkIfUserExists(email, password);

    if (!userExists) {
      return;
    }

    authStore.setDemoMode(demoMode);

    if (rememberMe) {
      authStore.saveSession({ email, password, demoMode });
    }
    authStore.setPassword(password);
    authStore.setEmail(email);

    authStore.needLogin = false;
    bluetoothStore.stopBluetooth();
    startUp(email, password);
    toggle();
  }

  function startUp(email: string, password: string) {
    mainLoading = true;

    windowStore.init();

    const handshakePayload = {
      type: DASH_CALL_TYPES.dash_handShakeType,
      data: { email, password }
    };
    sendWSMessage(handshakePayload);

    if (authStore.isDemoMode) {
      configStore.loadMockConfig();
      deviceStatusStore.loadDeviceStatusMock();
      controllerStore.loadMockData();
      mainLoading = false;
      authStore.needLogin = false;
      return;
    }

    setTimeout(() => {
      noConfigFetch = true;
    }, TIMEOUT_FETCH_CONFIG);
  }

  async function onWsOpen() {
    authStore.init();
    if (authStore.email && authStore.password) {
      const userExists = await authStore.checkIfUserExists(authStore.email, authStore.password);
      if (userExists) {
        authStore.needLogin = false;
        startUp(authStore.email, authStore.password);
      } else {
        authStore.needLogin = true;
      }
    } else {
      authStore.needLogin = true;
      toggle('login', {
        onLogin: (password: string, email: string, rememberMe: boolean, demoMode: boolean) => onNewLogin(password, email, rememberMe, demoMode)
      });
    }
  }

  function onWsClose() {
    noWsConnection = true;
  }

  $effect(() => {
    if (configStore?.config?.settings?.prefetchHistorical && !historicalQueried && $page.url.pathname !== '/monitoring') {
      historicalQueried = true;
      monitoringStore.queryHistorical();
    }
  });

  onMount(async () => {
    WSClientHandler(onWsOpen, onWsClose);
    bluetoothStore.init();
  });
</script>

<div class="main-layout">
  {#if authStore.needLogin}
    <Modal />
  {:else if mainLoading && !noConfigFetch && !configStore.config}
    <InitLoadingBackdrop />
  {:else if configStore.config}
    <Modal />
    <Header />
    <div class="content">
      <span class="page-title">{getCurrentPageTitle()}</span>
      {@render children()}
    </div>
    <Footer />
  {:else if noConfigFetch}
    <div class="no-config-container">
      <span class="no-config-msg">Could not fetch config...</span>
      <PrimaryButton label="New Login" type="green" onclick={() => authStore.removeSessionAndReload()} />
    </div>
  {:else if noWsConnection}
    <div class="no-config-container">
      <span class="no-config-msg">No connection to server...</span>
      <PrimaryButton label="Try reconnecting" type="green" onclick={() => location.reload()} />
    </div>
  {/if}
</div>

<style lang="scss">
  @use '$lib/variables.scss';

  .main-layout {
    width: calc(100vw - 128px);
    min-height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 32px 64px;

    @media screen and (max-width: variables.$mobile-bp) {
      margin: 8px;
      width: calc(100vw - 16px);
      min-height: calc(100vh - 16px);
      height: auto;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .page-title {
    margin: 64px 42px;
    font-size: var(--font-L);
    font-weight: bold;

    @media screen and (max-width: variables.$mobile-bp) {
      margin: 32px;
    }

    @media screen and (max-width: variables.$small-mobile-bp) {
      margin: 24px;
    }
  }

  .no-config-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: fit-content;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .no-config-msg {
    font-size: var(--font-ML);
  }
</style>
