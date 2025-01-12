<?php

namespace App\Console\Commands;

use App\Models\AllowedIpAddresses;
use Illuminate\Console\Command;

class AddIpAddressToDataBaseCommand extends Command
{
    protected $signature = 'add:ip-address-to-data-base';

    protected $description = 'Command description';

    public function handle(): void
    {
        $ipAddress = $this->ask('Please enter the IP address');

        $this->info('The IP address is: ' . $ipAddress);

        AllowedIpAddresses::create([
            'ip_address' => $ipAddress
        ]);

        $this->info('The IP address has been added to the database');
    }
}
