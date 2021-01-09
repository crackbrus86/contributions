<?php

function membersMap($member)
{
    $nextMember = $member;
    $nextMember->otherFederationMembership = (bool) $nextMember->otherFederationMembership;
    $nextMember->isContributed = (bool) $nextMember->isContributed;
    return $nextMember;
}

function membershipMap($membership)
{
    $nextMembership = $membership;
    $nextMembership->isContributed = (bool) $nextMembership->isContributed;
    return $nextMembership;
}