import { log } from 'brolog'

function onLogout() {
  log.info('onLogout', 'done')
}
// module.exports = onLogout
export { onLogout }
