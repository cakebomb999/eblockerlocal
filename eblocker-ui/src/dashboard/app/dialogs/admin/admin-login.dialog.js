/*
 * Copyright 2020 eBlocker Open Source UG (haftungsbeschraenkt)
 *
 * Licensed under the EUPL, Version 1.2 or - as soon they will be
 * approved by the European Commission - subsequent versions of the EUPL
 * (the "License"); You may not use this work except in compliance with
 * the License. You may obtain a copy of the License at:
 *
 *   https://joinup.ec.europa.eu/page/eupl-text-11-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
export default function AdminLoginDialogController(logger, $scope, security, DeviceService, DeviceSelectorService,
                                                   $mdDialog, APP_CONTEXT, onCancel, onOk) {
    'ngInject';
    let vm = this;
    vm.devices = [];
    vm.loggedIn = false;

    vm.cancel = function() {
        onCancel(vm.loggedIn);
        $mdDialog.cancel();
    };

    function loadDevices() {
        DeviceService.getDevices().then(function(response) {
            //alert('Got devices: ' + JSON.stringify(response));
            let devices = response.filter(device => !device.isEblocker);
            DeviceSelectorService.setDevices(devices);
            vm.devices = DeviceSelectorService.getDevicesByName();
        }, function(reason) {
            logger.error('Failed: ' + JSON.stringify(reason));
        });
    }

    vm.selectDevice = function(deviceId) {
        //alert('You selected: ' + deviceId);
        onOk(deviceId);
        $mdDialog.hide();
    };

    vm.login = function() {
        security.requestAdminToken(APP_CONTEXT.adminAppContextName, vm.adminPassword).then(function success(response) {
            //alert('Got response: ' + JSON.stringify(response));
            vm.loggedIn = true;
            loadDevices();
            //onOk();
            //$mdDialog.hide();
        }, function (reason) {
            logger.error('Admin login failed: ' + reason);
            if (reason === 'error.credentials.invalid') {
                vm.backendErrorKey = 'PASSWORD_INVALID';
            } else if (reason === 'error.credentials.too.soon') {
                vm.backendErrorKey = 'PASSWORD_TOO_FREQ';
            } else {
                vm.backendErrorKey = 'UNKNOWN';
            }
            vm.passwordForm.adminPassword.$setValidity('backend', false);
        });
    };

}
