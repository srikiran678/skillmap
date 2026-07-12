import { createClient } from '@insforge/sdk';

const baseUrl = import.meta.env.VITE_INSFORGE_URL || 'https://4k4iiusm.ap-southeast.insforge.app';
const anonKey = import.meta.env.VITE_INSFORGE_ANON_KEY || 'ik_27cc2a12f241810157ae27457d2d16aa';

console.log('Initializing InsForge Client:', { baseUrl, hasAnonKey: !!anonKey });

const insforge = createClient({
  baseUrl,
  anonKey,
});

export default insforge;
