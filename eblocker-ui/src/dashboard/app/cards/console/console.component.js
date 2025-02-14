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
export default {
    templateUrl: 'app/cards/console/console.component.html',
    controller: ConsoleController,
    controllerAs: 'vm',
    bindings: {
        cardId: '@'
    }
};

function ConsoleController($scope, $timeout, LanguageService, RedirectService, NetworkService,
                           CardService, registration, DeviceSelectorService, EVENTS) {
    'ngInject';
    'use strict';

    const vm = this;

    const CARD_NAME = 'CONSOLE'; // 'card-6'

    vm.openConsole = openConsole;

    vm.$onInit = function() {

        NetworkService.getNetworkStatus().then(function success(response) {
            if (angular.isObject(response.data)) {
                vm.gateway = response.data.gateway;
                vm.eblocker = response.data.ipAddress;
                vm.localDevice = response.data.userIpAddress;
                setDeviceIp();
            }
        });
    };

    $scope.$on(EVENTS.DEVICE_SELECTED, setDeviceIp);

    vm.$postLink = function() {
        $timeout(function() {
            CardService.scrollToCard(CARD_NAME);
        }, 300);
    };

    function setDeviceIp() {
        if (DeviceSelectorService.isLocalDevice()) {
            vm.device = vm.localDevice;
        } else {
            vm.device = DeviceSelectorService.getSelectedDevice().ipAddresses[0];
        }
    }

    function openConsole() {
        RedirectService.toConsole(false);
    }
}
