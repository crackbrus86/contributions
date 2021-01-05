<?php

function membersMap($member)
{
    $nextMember = $member;
    $nextMember->otherFederationMembership = (bool) $nextMember->otherFederationMembership;
    $nextMember->isContributed = (bool) $nextMember->isContributed;
    return $nextMember;
}